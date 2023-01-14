import { TError } from "../error";
import { $base } from "./base";
import { type ParseResult } from "./schema";


export class $literal<T> extends $base<T> {
  static create<T extends string | number | boolean | symbol>(v: T) {
    return new $literal<T>(v);
  }

  private constructor(private v: T) {
    super();
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === this.v) {
      return {
        success: true,
        data: x as T,
      };
    }

    return {
      success: false,
      error: new TError({ code: "literal.type", path: [] }),
    };
  }
}
