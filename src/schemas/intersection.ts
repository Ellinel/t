import { TError } from "../error";
import type { Dic, Prettier } from "../types";
import { $base } from "./base";
import { $object } from "./object";
import { Schema, type ParseResult } from "./schema";
import { $union } from "./union";

type Intersection<S extends unknown[], U = unknown> = S extends [
  s: $union<infer T>,
  ...rest: infer R
]
  ? Intersection<R, T & U>
  : S extends [s: $object<infer T>, ...rest: infer R]
  ? Intersection<R, T & U>
  : Prettier<U>;

export class $intersection<T> extends $base<T> {
  static create<S extends $object<Dic>[]>(
    ...schemas: S
  ): $intersection<Intersection<S>>;

  static create<S extends $union<unknown>[]>(
    ...schemas: S
  ): $intersection<Intersection<S>>;

  static create(...schemas: Schema[]) {
    return new $intersection<unknown>(schemas);
  }

  constructor(private schemas: Schema[]) {
    super();
  }

  private parseObject(x: unknown): ParseResult<T> {
    let error: TError | undefined;

    const data = {};

    for (const schema of this.schemas) {
      const result = schema.safeParse(x);
      if (result.success) {
        Object.assign(data, result.data);
      } else {
        error ??= new TError();
        error.merge(result.error);
      }
    }

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data: x as T,
    };
  }

  private parseUnion(x: unknown): ParseResult<T> {
    let error: TError | undefined;

    let data: T | undefined;

    for (const schema of this.schemas) {
      const result = schema.safeParse(x);
      if (result.success) {
        data ??= result.data as T;
      } else {
        error ??= new TError();
        error.merge(result.error);
      }
    }

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data: x as T,
    };
  }

  safeParse(x: unknown): ParseResult<T> {
    if (this.schemas[0] instanceof $object) {
      return this.parseObject(x);
    }

    if (this.schemas[0] instanceof $union) {
      return this.parseUnion(x);
    }

    return {
      success: false,
      error: new TError({ code: "intersection.unknown", path: [] }),
    };
  }
}
