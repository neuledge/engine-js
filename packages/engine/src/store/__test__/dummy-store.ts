import { Store } from '../store.js';

export class DummyStore implements Store {
  async listCollections() {
    return [];
  }

  async describeCollection(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  async ensureCollection() {
    // do nothing
  }

  async dropCollection() {
    // do nothing
  }

  async find() {
    return [];
  }

  async insert() {
    return { affectedCount: 0 };
  }

  async update() {
    return { affectedCount: 0 };
  }

  async delete() {
    return { affectedCount: 0 };
  }
}
