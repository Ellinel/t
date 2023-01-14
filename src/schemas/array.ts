import { TError } from "../error";
import { $default } from "./default";
import { $nullable } from "./nullable";
import { $optional } from "./optional";
import { Schema, type ParseResult } from "./schema";

export type ArrayConfig = {
  max?: number;
  min?: number;
  length?: number;
  nonempty?: boolean;
};

export class $array<T> extends Schema<T[]> {
  static create<T>(element: Schema<T>) {
    return new $array<T>(element);
  }

  private constructor(
    readonly element: Schema<T>,
    private config: ArrayConfig = {},
  ) {
    super();
  }

  max(max: number): $array<T> {
    return new $array(this.element, {
      ...this.config,
      max,
    });
  }

  min(min: number): $array<T> {
    return new $array(this.element, {
      ...this.config,
      min,
    });
  }

  length(length: number): $array<T> {
    return new $array(this.element, {
      ...this.config,
      length,
    });
  }

  nonempty(): $array<T> {
    return new $array(this.element, {
      ...this.config,
      nonempty: true,
    });
  }

  array(): $array<T[]> {
    return $array.create(this);
  }

  default(v: T[]): $default<T[]> {
    return $default.create(this, v);
  }

  optional(): $optional<T[]> {
    return $optional.create(this);
  }

  nullable(): $nullable<T[]> {
    return $nullable.create(this);
  }

  safeParse(x: unknown): ParseResult<T[]> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "array.required", path: [] }),
      };
    }

    if (!Array.isArray(x)) {
      return {
        success: false,
        error: new TError({ code: "array.type", path: [] }),
      };
    }

    if (this.config.length != null && x.length !== this.config.length) {
      return {
        success: false,
        error: new TError({ code: "array.length", path: [] }),
      };
    }

    if (this.config.max != null && x.length > this.config.max) {
      return {
        success: false,
        error: new TError({ code: "array.max", path: [] }),
      };
    }

    if (this.config.min != null && x.length < this.config.min) {
      return {
        success: false,
        error: new TError({ code: "array.min", path: [] }),
      };
    }

    if (this.config.nonempty && x.length === 0) {
      return {
        success: false,
        error: new TError({ code: "array.nonempty", path: [] }),
      };
    }

    let error: TError | undefined;

    const data = [];
    for (const [index, item] of x.entries()) {
      const result = this.element.safeParse(item);
      if (result.success) {
        data[index] = result.data;
      } else {
        error ??= new TError();
        error.merge(result.error, index);
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
      data: data as T[],
    };
  }
}
