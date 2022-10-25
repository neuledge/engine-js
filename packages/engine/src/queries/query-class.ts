import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';

export class QueryClass<I extends State, O extends State>
  implements
    SelectQuery<any, I, O, any>,
    FilterQuery<I>,
    UniqueQuery<any, I, O, any>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<any>
{
  constructor(private readonly _states: I[], x?: any, y?: any) {}

  select(select?: any): QueryClass<I, O> {
    return this;
  }

  includeMany(key: any, states?: any, query?: any): this {
    return this;
  }

  includeOne(key: any, states?: any, query?: any): this {
    return this;
  }

  requireOne(key: any, states?: any, query?: any): this {
    return this;
  }

  where(where: any): this {
    return this;
  }

  unique(where: any): this {
    return this;
  }

  filter(key: any): this {
    return this;
  }

  limit(key: any): this {
    return this;
  }

  offset(key: any): this {
    return this;
  }

  exec(): any {
    return this;
  }

  // eslint-disable-next-line unicorn/no-thenable
  then(onfulfilled?: any, onrejected?: any): Promise<any> {
    return this.exec().than(onfulfilled, onrejected);
  }
}
