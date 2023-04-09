import { TError } from "../error";
import { $base } from "./base";
import { type Schema, type ParseResult } from "./schema";


export class $union<T> extends $base<T> {
  static create<T extends Schema[]>(...schemas: T) {
    return new $union<T extends Schema<infer I>[] ? I : unknown>(schemas);
  }

  private constructor(private schemas: Schema[]) {
    super();
  }

  safeParse(x: unknown): ParseResult<T> {
    let error: TError | undefined;

    for (const schema of this.schemas) {
      const result = schema.safeParse(x);
      if (result.success) {
        return {
          success: true,
          data: x as T,
        };
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
      success: false,
      error: new TError({ code: "union.unknown", path: [] }),
    };
  }
}
