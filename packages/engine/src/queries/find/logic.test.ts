import {
  FindFirstLogic,
  FindFirstOrThrowLogic,
  FindLogic,
  FindLogicResponse,
  FindManyLogic,
} from './logic.js';

describe('find/logic', () => {
  describe('FindLogicResponse<>', () => {
    class Test<R, L extends FindLogic> {
      transform<R>(): Test<R, L> {
        return new Test();
      }

      exec(): FindLogicResponse<R, L> {
        return void 0 as never;
      }
    }

    it('should return find first logic', () => {
      const t = new Test<number, FindFirstLogic>().exec();
      expect<number | undefined>(t);

      // @ts-expect-error Type should have undefined
      expect<number>(t);
    });

    it('should return find first or throw logic', () => {
      const t = new Test<number, FindFirstOrThrowLogic>().exec();
      expect<number>(t);

      // @ts-expect-error Type should not have undefined
      expect<undefined>(t);
    });

    it('should return find many logic', () => {
      const t = new Test<number, FindManyLogic>().exec();
      expect<number[]>(t);
    });

    it('should transform and return find first logic', () => {
      const t = new Test<number, FindFirstLogic>().transform<string>().exec();
      expect<string | undefined>(t);

      // @ts-expect-error Type should have undefined
      expect<string>(t);
    });

    it('shouldtransform and return find first or throw logic', () => {
      const t = new Test<number, FindFirstOrThrowLogic>()
        .transform<string>()
        .exec();
      expect<string>(t);

      // @ts-expect-error Type should not have undefined
      expect<undefined>(t);
    });

    it('should transform and return find many logic', () => {
      const t = new Test<number, FindManyLogic>().transform<string>().exec();
      expect<string[]>(t);
    });
  });
});
