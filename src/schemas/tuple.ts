import { TError } from "../error";
import { $base } from "./base";
import { type Schema, type Infer, type ParseResult } from "./schema";

export class $tuple<T extends unknown[]> extends $base<T> {
  static create<T extends Schema[]>(...schemas: T) {
    return new $tuple<{
      [I in keyof T]: Infer<T[I]>;
    }>(schemas);
  }

  private constructor(private schemas: Schema[]) {
    super();
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "tuple.required", path: [] }),
      };
    }

    if (!Array.isArray(x)) {
      return {
        success: false,
        error: new TError({
          code: "tuple.type",
          path: [],
        }),
      };
    }

    if (x.length !== this.schemas.length) {
      return {
        success: false,
        error: new TError({ code: "tuple.length", path: [] }),
      };
    }

    let error: TError | undefined;

    const data = [];
    for (const [index, schema] of this.schemas.entries()) {
      const item = x[index];
      const result = schema.safeParse(item);
      if (result.success) {
        data[index] = result.data;
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
      data: data as T,
    };
  }
}
