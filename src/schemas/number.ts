import { TError } from "../error";
import { isNumber } from "../utils";
import { $base } from "./base";
import { type ParseResult } from "./schema";

type NumberConfig = {
  max?: number;
  min?: number;
};

export class $number extends $base<number> {
  static create() {
    return new $number();
  }

  private constructor(private config: NumberConfig = {}) {
    super();
  }

  max(max: number) {
    return new $number({
      ...this.config,
      max,
    });
  }

  min(min: number) {
    return new $number({
      ...this.config,
      min,
    });
  }

  safeParse(x: unknown): ParseResult<number> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "number.required", path: [] }),
      };
    }

    if (!isNumber(x)) {
      return {
        success: false,
        error: new TError({ code: "number.type", path: [] }),
      };
    }

    if (isNumber(this.config.max) && x > this.config.max) {
      return {
        success: false,
        error: new TError({ code: "number.max", path: [] }),
      };
    }

    if (isNumber(this.config.min) && x < this.config.min) {
      return {
        success: false,
        error: new TError({ code: "number.min", path: [] }),
      };
    }

    return {
      success: true,
      data: x,
    };
  }
}
