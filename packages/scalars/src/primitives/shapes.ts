import { StoreShape } from '@neuledge/store';

export const getBigIntShape = (
  minRange?: bigint | null,
  maxRange?: bigint | null,
): StoreShape<'number'> => {
  const shape: StoreShape<'number'> = { type: 'number', scale: 0 };

  if (minRange == null) {
    return shape;
  }

  shape.unsigned = (minRange ?? -1n) >= 0n;

  if (maxRange == null) {
    return shape;
  }

  shape.precision = Math.max(
    (maxRange >= 0n ? maxRange : -maxRange).toString().length,
    (minRange >= 0n ? minRange : -minRange).toString().length,
  );

  return shape;
};

export const booleanShape: StoreShape<'boolean'> = { type: 'boolean' };

export const getBinaryShape = (size?: number | null): StoreShape<'binary'> => ({
  type: 'binary',
  size,
});

export const dateTimeShape: StoreShape<'date-time'> = { type: 'date-time' };

export const getIntergerShape = (
  minRange = -Infinity,
  maxRange = Infinity,
): StoreShape<'number'> => {
  const shape: StoreShape<'number'> = { type: 'number', scale: 0 };

  if (minRange >= 0) {
    shape.unsigned = true;

    if (maxRange <= 255) {
      shape.size = 1;
    } else if (maxRange <= 65_535) {
      shape.size = 2;
    } else if (maxRange <= 4_294_967_295) {
      shape.size = 4;
    } else {
      shape.size = 8;
    }

    return shape;
  } else {
    if (minRange >= -128 && maxRange <= 127) {
      shape.size = 1;
    } else if (minRange >= -32_768 && maxRange <= 32_767) {
      shape.size = 2;
    } else if (minRange >= -2_147_483_648 && maxRange <= 2_147_483_647) {
      shape.size = 4;
    } else {
      shape.size = 8;
    }
  }

  return shape;
};

export const getNumberShape = (
  precision?: number | null,
  scale?: number | null,
): StoreShape<'number'> => ({
  type: 'number',
  size: 8,
  precision,
  scale,
});

export const jsonShape: StoreShape<'json'> = { type: 'json' };

export const getStringShape = (size?: number | null): StoreShape<'string'> => ({
  type: 'string',
  size,
});
