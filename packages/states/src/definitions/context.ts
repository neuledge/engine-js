import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import {
  parseRootNode,
  RootBodyNode,
  RootNode,
  StateNode,
} from '@/ast/index.js';
import { ParsingError } from '@/parsing-error.js';
import { TokensParser } from '@/tokens/index.js';
import {
  defineState,
  defineStateRef,
  StateDefinition,
  StateDefinitionRef,
} from './state.js';
import { ScalarDefinition } from './scalar.js';
import { EitherDefinition } from './either.js';
import { scalars } from './scalars/index.js';
import { DocumentDefinition } from './document.js';

export class StatesContext {
  public states: Record<string, StateDefinition[]> = {};
  public scalars: Record<string, ScalarDefinition> = { ...scalars };
  public eithers: Record<string, EitherDefinition> = {};

  private stateRefs: Record<
    string,
    {
      ref: StateDefinitionRef | StateDefinition;
      content: string;
      filepath?: string;
      node: StateNode;
    }[]
  > = {};
  private imported = new Map<string, DocumentDefinition>();

  constructor(public readonly basepath: string = '') {}

  async import(
    filename: string,
    basepath = this.basepath,
  ): Promise<DocumentDefinition> {
    this.stateRefs = {};

    const res = await this.importRefs(filename, basepath);
    this.populateStateRefs();

    return res;
  }

  async exec(content: string, filepath?: string): Promise<DocumentDefinition> {
    this.stateRefs = {};

    const res = await this.execRefs(content, filepath);
    this.populateStateRefs();

    return res;
  }

  private async importRefs(
    filename: string,
    basepath: string,
  ): Promise<DocumentDefinition> {
    const filepath = resolve(basepath, filename);

    let res = this.imported.get(filepath);
    if (!res) {
      const buffer = await readFile(filepath);
      const content = buffer.toString();

      res = await this.execRefs(content, filepath);

      this.imported.set(filepath, res);
    }

    return res;
  }

  private async execRefs(
    content: string,
    filepath?: string,
  ): Promise<DocumentDefinition> {
    const res: DocumentDefinition = { scalars: {}, states: {}, eithers: {} };

    try {
      const root = this.parse(content);

      for (const node of root.imports) {
        await this.importRefs(
          node.path,
          filepath ? dirname(filepath) : this.basepath,
        );
      }

      for (const node of root.body) {
        this.registerRef(res, content, filepath, node);
      }
    } catch (error) {
      throw StatesContext.enhanceError(error, content, filepath);
    }

    return res;
  }

  // references

  getStateRef(
    name: string,
    version?: number,
  ): StateDefinition | StateDefinitionRef | undefined {
    const states = this.states[name] || [];
    const statesRefs = this.stateRefs[name] || [];

    if (version == null) {
      version = Math.max(states.length, statesRefs.length);
    }

    return states[version - 1] || statesRefs[version - 1]?.ref;
  }

  private registerRef(
    root: DocumentDefinition,
    content: string,
    filepath: string | undefined,
    node: RootBodyNode,
  ): void {
    switch (node.type) {
      case 'State': {
        const ref = defineStateRef(node);
        const { name, version } = ref;

        if (this.states[name]?.[version - 1]) {
          throw new ParsingError(
            node.id,
            `Cannot redeclare state '${name}@${version}'`,
          );
        }

        if (!this.stateRefs[name]) {
          this.stateRefs[name] = [];
        }
        if (!root.states[name]) {
          root.states[name] = [];
        }

        this.stateRefs[name][version - 1] = { ref, content, filepath, node };
        root.states[name][version - 1] = ref as never;

        break;
      }

      default: {
        throw new Error(`Unsupported node type '${node.type}'`);
      }
    }
  }

  private populateStateRefs(): void {
    const states: StateDefinition[] = [];

    let stateRefs = Object.values(this.stateRefs).flat();
    while (stateRefs.length) {
      const refs = stateRefs.filter(({ ref, node, content, filepath }) => {
        let state;

        try {
          state = defineState(this, ref, node);
        } catch (error) {
          throw StatesContext.enhanceError(error, content, filepath);
        }
        if (!state) return true;

        states.push(state);
        return false;
      });

      if (stateRefs.length === refs.length) {
        const { node, content, filepath } = stateRefs[0];

        throw StatesContext.enhanceError(
          new ParsingError(node, `Circular dependency detected`),
          content,
          filepath,
        );
      }

      stateRefs = refs;
    }

    for (const item of states) {
      if (!this.states[item.name]) this.states[item.name] = [];

      this.states[item.name][item.version - 1] = item;
    }
    this.stateRefs = {};
  }

  // parsing

  private parse(content: string): RootNode {
    const cursor = new TokensParser(content);
    return parseRootNode(cursor);
  }

  private static enhanceError<T>(
    error: T,
    content: string,
    filepath?: string,
  ): T {
    const { start } = (error || {}) as ParsingError;

    if (start == null) {
      return error;
    }

    let path;
    if (filepath) {
      const lines = content.slice(0, start).split(/\n/g);
      const column = lines[lines.length - 1].length + 1;

      path = `file://${filepath}:${lines.length}:${column}`;
    } else {
      path = `${(error as ParsingError).constructor.name}:${start}`;
    }

    (error as ParsingError).path = path;

    return error;
  }
}
