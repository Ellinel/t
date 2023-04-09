import { TError } from "../error";
import { type Class } from "../types";
import { $base } from "./base";
import { type ParseResult } from "./schema";

export class $instanceof<T extends Class> extends $base<T> {
  static create<T extends Class>(Class: T) {
    new $instanceof(Class);
  }

  private constructor(private Class: T) {
    super();
  }

  safeParse(x: unknown): ParseResult<T> {
    if (!(x instanceof this.Class)) {
      return {
        success: false,
        error: new TError({ code: "intersection.type", path: [] }),
      };
    }

    return {
      success: true,
      data: x as T,
    };
  }
}
