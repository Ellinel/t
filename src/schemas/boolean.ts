import { TError } from "../error";
import { $base } from "./base";
import { type ParseResult } from "./schema";

export class $boolean extends $base<boolean> {
  static create() {
    return new $boolean();
  }

  private constructor() {
    super();
  }

  safeParse(x: unknown): ParseResult<boolean> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "boolean.required", path: [] }),
      };
    }

    if (typeof x !== "boolean") {
      return {
        success: false,
        error: new TError({ code: "boolean.type", path: [] }),
      };
    }

    return {
      success: true,
      data: x,
    };
  }
}
