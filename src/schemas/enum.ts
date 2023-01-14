import { TError } from "../error";
import type { Key } from "../types";
import { includes, isObject } from "../utils";
import { $base } from "./base";
import type { ParseResult } from "./schema";

export class $enum<T> extends $base<T> {
  static create<T extends Key>(first: T, ...items: T[]): $enum<T>;

  static create<T extends Key>(
    items: readonly [T, ...T[]] | [T, ...T[]],
  ): $enum<T>;

  static create<T extends object>(map: T): $enum<T[keyof T]>;

  static create(...args: unknown[]) {
    const [arg1] = args;
    if (Array.isArray(arg1)) {
      return new $enum(arg1);
    }

    if (isObject(arg1)) {
      return new $enum(Object.values(arg1));
    }

    return new $enum(args);
  }

  private constructor(private values: T[]) {
    super();
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "enum.required", path: [] }),
      };
    }

    if (includes(this.values, x)) {
      return {
        success: true,
        data: x as T,
      };
    }

    return {
      success: false,
      error: new TError({ code: "enum.type", path: [] }),
    };
  }
}
