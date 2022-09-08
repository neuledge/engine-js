import 'reflect-metadata';

export const createDecorator = <T>(
  metadataKey: string | symbol,
  metadataValue: T,
) => Reflect.metadata(metadataKey, metadataValue);

export const getPropertyMetadata =
  <T>(metadataKey: string | symbol) =>
  (target: object, propertyKey: string): T | undefined =>
    Reflect.getMetadata(metadataKey, target, propertyKey);

export const getClassMetadata =
  <T>(metadataKey: string | symbol) =>
  (target: object): T | undefined =>
    Reflect.getMetadata(metadataKey, target.constructor);
