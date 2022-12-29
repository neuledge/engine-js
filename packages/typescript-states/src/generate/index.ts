import { Entity, StatesContext } from '@neuledge/states';
import { generateEither } from './either';
import { generateImports } from './imports';
import { generateState } from './state';

type GeneratedCode = {
  source: string;
  order: number;
};

export const generate = (
  context: StatesContext,
  entities: Iterable<Entity> = context.entities(),
): string => {
  const res: GeneratedCode[] = [{ source: generateImports(), order: 0 }];

  for (const entity of entities) {
    switch (entity.type) {
      case 'Scalar':
        if (entity.builtIn) break;

        // TODO generate scalars code
        // res.push({ source: generateScalar(entity), order: 1 });
        break;

      case 'State': {
        res.push({ source: generateState(entity), order: 2 });
        break;
      }

      case 'Either':
        res.push({ source: generateEither(entity), order: 3 });
        break;

      default:
        // @ts-expect-error `entity.type` is never
        throw new TypeError(`Unsupported entity type '${entity.type}'`);
    }
  }

  return (
    res
      .sort((a, b) => a.order - b.order)
      .map(({ source }) => source)
      .join('\n\n') + '\n'
  );
};
