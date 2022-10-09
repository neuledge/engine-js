import {
  DocumentBodyNode,
  DocumentNode,
  EntityNode,
  LiteralNode,
  MigrationNode,
  MutationNode,
  parseDocumentNode,
} from '@/nodes/index.js';
import { resolve, dirname } from 'node:path';
import { Tokenizer } from '@/tokenizer.js';
import { ParsingError } from '@/parsing-error.js';

export class StatesContext {
  private readonly entityMap: Partial<Record<string, EntityNode>> = {};
  private readonly mutationMap: Partial<
    Record<`${string | ''}.${string}`, MutationNode>
  > = {};
  private readonly migrationMap: Partial<
    Record<`${string}->${string}`, MigrationNode>
  > = {};

  private readonly imported: Partial<Record<string, Promise<DocumentNode>>> =
    {};

  constructor(
    private readonly load: (filename: string) => PromiseLike<string>,
    private readonly basepath: string = '',
  ) {}

  entity(name: string): EntityNode | undefined {
    return this.entityMap[name];
  }

  mutation(stateName: string | null, name: string): MutationNode | undefined {
    return this.mutationMap[`${stateName || ''}.${name}`];
  }

  migration(origin: string, target: string): MigrationNode | undefined {
    return this.migrationMap[`${origin}->${target}`];
  }

  async import(
    filename: string,
    basepath = this.basepath,
  ): Promise<DocumentNode> {
    return this.execImport(filename, basepath);
  }

  async exec(content: string, filepath?: string): Promise<DocumentNode> {
    const cursor = new Tokenizer(content, filepath);
    const res = parseDocumentNode(cursor);

    if (res.imports.length) {
      const basepath = filepath ? dirname(filepath) : this.basepath;

      let oldImport;
      if (filepath) {
        oldImport = this.imported[filepath];
        this.imported[filepath] = Promise.resolve(res);
      }

      for (const item of res.imports) {
        await this.execImport(item.source.value, basepath, item.source);
      }

      if (filepath) {
        this.imported[filepath] = oldImport;
      }
    }

    for (const item of res.body) {
      this.register(item);
    }

    return res;
  }

  private async execImport(
    filename: string,
    basepath: string,
    source?: LiteralNode<string>,
  ): Promise<DocumentNode> {
    const filepath = resolve(basepath, filename);
    let res = this.imported[filepath];

    if (!res) {
      res = this.imported[filepath] = Promise.resolve(this.load(filepath))
        .then(
          (content) => this.exec(content, filepath),
          (error) => {
            throw source
              ? new ParsingError(
                  source,
                  `Can't import path '${filename}': ${
                    error?.message || String(error)
                  }`,
                )
              : new Error(
                  `Can't import path '${filename}': ${
                    error?.message || String(error)
                  }`,
                );
          },
        )
        .catch((error) => {
          delete this.imported[filepath];
          throw error;
        });
    }

    return res;
  }

  register(node: DocumentBodyNode): void {
    switch (node.type) {
      case 'Either':
      case 'Scalar':
      case 'State': {
        const { name } = node.id;

        if (this.entity(name)) {
          throw new ParsingError(node.id, `The name '${name}' already defined`);
        }

        this.entityMap[name] = node;
        break;
      }

      case 'Migration': {
        const key = `${node.origin.name}->${node.returns.name}` as const;

        if (this.migrationMap[key]) {
          throw new ParsingError(
            node.origin,
            `The migration from state '${node.origin.name}' to state '${node.returns.name}' already defined`,
          );
        }

        this.migrationMap[key] = node;
        break;
      }

      case 'Mutation': {
        const key = `${node.state?.name || ''}.${node.key.name}` as const;

        if (this.mutationMap[key]) {
          throw new ParsingError(
            node.key,
            `The mutation '${key}' already defined`,
          );
        }

        this.mutationMap[key] = node;
        break;
      }

      default: {
        // @ts-expect-error `node.type` should be never
        throw new Error(`Unsupported document node '${node.type}'`);
      }
    }
  }
}
