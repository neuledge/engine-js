export type StateSort<T> = `${'+' | '-'}${keyof T & string}`[];
