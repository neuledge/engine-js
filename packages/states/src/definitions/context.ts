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

export class StatesContext {
  public states: Record<string, StateDefinition[]> = {};

  private stateRefs: Record<
    string,
    {
      ref: StateDefinitionRef | StateDefinition;
      content: string;
      filepath?: string;
      node: StateNode;
    }[]
  > = {};
  private imported = new Set<string>();

  constructor(public readonly basepath: string = '') {}

  async import(path: string, basepath = this.basepath): Promise<void> {
    this.stateRefs = {};

    await this.importRefs(path, basepath);
    this.populateStateRefs();
  }

  async exec(content: string, filepath?: string): Promise<void> {
    this.stateRefs = {};

    await this.execRefs(content, filepath);
    this.populateStateRefs();
  }

  private async importRefs(path: string, basepath: string) {
    const filepath = resolve(basepath, path);
    if (this.imported.has(filepath)) {
      return;
    }

    const buffer = await readFile(filepath);
    const content = buffer.toString();

    await this.execRefs(content, filepath);

    this.imported.add(filepath);
  }

  private async execRefs(content: string, filepath?: string): Promise<void> {
    try {
      const root = this.parse(content);

      for (const node of root.imports) {
        await this.importRefs(
          node.path,
          filepath ? dirname(filepath) : this.basepath,
        );
      }

      for (const node of root.body) {
        this.registerRef(content, filepath, node);
      }
    } catch (error) {
      throw StatesContext.enhanceError(error, content, filepath);
    }
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

        this.stateRefs[name][version - 1] = { ref, content, filepath, node };

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
    const { start, message: orgMsg } = (error || {}) as ParsingError;

    if (start == null || orgMsg == null) {
      return error;
    }

    let message;
    if (filepath) {
      const lines = content.slice(0, start).split(/\n/g);
      const column = lines[lines.length - 1].length;

      message = `${filepath}(${lines.length},${column}): ${orgMsg}`;
    } else {
      message = `${orgMsg} (pos: ${start})`;
    }

    (error as ParsingError).message = message;

    return error;
  }
}
