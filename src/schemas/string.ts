import { TError } from "../error";
import { $base } from "./base";
import { type ParseResult } from "./schema";

type StringConfig = {
  max?: number;
  min?: number;
  length?: number;
  nonempty?: boolean;
  startsWith?: string;
  endsWith?: string;
  regex?: RegExp;
};

export class $string extends $base<string> {
  static create() {
    return new $string();
  }

  private constructor(private config: StringConfig = {}) {
    super();
  }

  max(max: number): $string {
    return new $string({
      ...this.config,
      max,
    });
  }

  min(min: number): $string {
    return new $string({
      ...this.config,
      min,
    });
  }

  length(length: number): $string {
    return new $string({
      ...this.config,
      length,
    });
  }

  nonempty(): $string {
    return new $string({
      ...this.config,
      nonempty: true,
    });
  }

  startsWith(startsWith: string): $string {
    return new $string({
      ...this.config,
      startsWith,
    });
  }

  endsWith(endsWith: string): $string {
    return new $string({
      ...this.config,
      endsWith,
    });
  }

  regex(regex: RegExp): $string {
    return new $string({
      ...this.config,
      regex,
    });
  }

  safeParse(x: unknown): ParseResult<string> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "string.required", path: [] }),
      };
    }

    if (typeof x !== "string") {
      return {
        success: false,
        error: new TError({ code: "string.type", path: [] }),
      };
    }

    if (this.config.nonempty && x === "") {
      return {
        success: false,
        error: new TError({ code: "string.nonempty", path: [] }),
      };
    }

    if (this.config.length != null && x.length !== this.config.length) {
      return {
        success: false,
        error: new TError({ code: "string.length", path: [] }),
      };
    }

    if (this.config.max != null && x.length > this.config.max) {
      return {
        success: false,
        error: new TError({ code: "string.max", path: [] }),
      };
    }

    if (this.config.min != null && x.length < this.config.min) {
      return {
        success: false,
        error: new TError({ code: "string.min", path: [] }),
      };
    }

    if (
      this.config.startsWith != null &&
      !x.startsWith(this.config.startsWith)
    ) {
      return {
        success: false,
        error: new TError({ code: "string.startsWith", path: [] }),
      };
    }

    if (this.config.endsWith != null && !x.endsWith(this.config.endsWith)) {
      return {
        success: false,
        error: new TError({ code: "string.endsWith", path: [] }),
      };
    }

    if (this.config.regex != null) {
      this.config.regex.lastIndex = 0;
      const match = this.config.regex.test(x);
      if (!match) {
        return {
          success: false,
          error: new TError({ code: "string.regex", path: [] }),
        };
      }
    }

    return {
      success: true,
      data: x,
    };
  }
}
