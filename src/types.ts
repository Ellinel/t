export type Key = number | string | symbol;

export type Dic<T = unknown> = Record<Key, T>;

export type Class<T = unknown> = {
  prototype: T;
  new (...args: unknown[]): T;
};

export type Prettier<T> = T extends object
  ? {
      [K in keyof T]: Prettier<T[K]>;
    }
  : T;
