import {
  SelectFirstLogic,
  SelectFirstOrThrowLogic,
  SelectLogic,
  SelectLogicResponse,
  SelectManyLogic,
} from './logic.js';

describe('select/logic', () => {
  describe('SelectLogicResponse<>', () => {
    class Test<R, L extends SelectLogic> {
      transform<R>(): Test<R, L> {
        return new Test();
      }

      exec(): SelectLogicResponse<R, L> {
        return void 0 as never;
      }
    }

    it('should return first logic', () => {
      const t = new Test<number, SelectFirstLogic>().exec();
      expect<number | undefined>(t);

      // @ts-expect-error Type should have undefined
      expect<number>(t);
    });

    it('should return first or throw logic', () => {
      const t = new Test<number, SelectFirstOrThrowLogic>().exec();
      expect<number>(t);

      // @ts-expect-error Type should not have undefined
      expect<undefined>(t);
    });

    it('should return many logic', () => {
      const t = new Test<number, SelectManyLogic>().exec();
      expect<number[]>(t);
    });

    it('should transform and return first logic', () => {
      const t = new Test<number, SelectFirstLogic>().transform<string>().exec();
      expect<string | undefined>(t);

      // @ts-expect-error Type should have undefined
      expect<string>(t);
    });

    it('should transform and return first or throw logic', () => {
      const t = new Test<number, SelectFirstOrThrowLogic>()
        .transform<string>()
        .exec();
      expect<string>(t);

      // @ts-expect-error Type should not have undefined
      expect<undefined>(t);
    });

    it('should transform and return many logic', () => {
      const t = new Test<number, SelectManyLogic>().transform<string>().exec();
      expect<string[]>(t);
    });
  });
});
