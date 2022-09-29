import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { parseRootNode, RootBodyNode, RootNode } from '@/ast/index.js';
import { ParsingError } from '@/parsing-error.js';
import { TokensParser } from '@/tokens/index.js';
import { defineState, StateDefinition } from './state.js';

export class StatesContext {
  public states: Record<string, StateDefinition[]> = {};
  private imported = new Set<string>();

  constructor(public readonly basepath: string = '') {}

  async import(path: string, basepath = this.basepath): Promise<void> {
    const filepath = resolve(basepath, path);
    if (this.imported.has(filepath)) {
      return;
    }

    const buffer = await readFile(filepath);
    const content = buffer.toString();

    const root = this.parse(content, filepath);
    this.imported.add(filepath);

    try {
      await this.exec(root, dirname(filepath));
    } catch (error) {
      throw StatesContext.enhanceError(error, content, filepath);
    }
  }

  async exec(root: RootNode, basepath?: string): Promise<void> {
    for (const node of root.imports) {
      await this.import(node.path, basepath);
    }

    for (const node of root.body) {
      this.define(node);
    }
  }

  // defines

  private define(node: RootBodyNode): void {
    switch (node.type) {
      case 'State': {
        const state = defineState(this, node);
        this.states[state.name][state.version] = state;
        break;
      }

      default: {
        throw new Error(`Unsupported node type '${node.type}'`);
      }
    }
  }

  // parsing

  private parse(content: string, filepath?: string): RootNode {
    try {
      const cursor = new TokensParser(content);
      return parseRootNode(cursor);
    } catch (error) {
      throw StatesContext.enhanceError(error, content, filepath);
    }
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
