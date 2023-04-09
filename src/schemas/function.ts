import { TError } from "../error";
import { isNumber } from "../utils";
import { $base } from "./base";
import { type ParseResult } from "./schema";

export type FunctionConfig = {
  length?: number;
};

export class $function<T> extends $base<T> {
  static create<T extends (...args: unknown[]) => unknown>() {
    return new $function<T>();
  }

  constructor(private config: FunctionConfig = {}) {
    super();
  }

  length(length: number) {
    return new $function({
      ...this.config,
      length,
    });
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "function.required", path: [] }),
      };
    }

    if (typeof x !== "function") {
      return {
        success: false,
        error: new TError({ code: "function.type", path: [] }),
      };
    }

    if (isNumber(this.config.length) && x.length !== this.config.length) {
      return {
        success: false,
        error: new TError({ code: "function.length", path: [] }),
      };
    }

    return {
      success: true,
      data: x as T,
    };
  }
}
