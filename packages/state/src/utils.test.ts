import { Merge } from './utils.js';

describe('utils', () => {
  describe('Merge<>', () => {
    it('should merge multiple interfaces', () => {
      type t1 = {
        a: string;
        b: number;
        e?: string;
      };

      type t2 = {
        a: string;
        c: number;
        e?: string;
      };

      type t3 = {
        a: number;
        d: string;
        b: string;
        e: string;
      };

      expect<{
        a: string | number;
        b?: string | number;
        c?: number;
        d?: string;
        e?: string;
      }>({} as Merge<t1 | t2 | t3>);
    });
  });
});
