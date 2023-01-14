import { TError } from "../error";
import type { Dic } from "../types";
import { isObject, keys } from "../utils";
import { Schema, type ParseResult, type Infer } from "./schema";
import { $base } from "./base";

export type ObjectConfig = {
  strict?: boolean;
};

export class $object<T extends Dic> extends $base<T> {
  static create<P extends Dic<Schema>>(props: P) {
    return new $object<{
      [K in keyof P]: Infer<P[K]>;
    }>(props);
  }

  private constructor(
    private props: Dic<Schema<unknown>>,
    private config: ObjectConfig = {},
  ) {
    super();
  }

  strict() {
    return new $object(this.props, {
      ...this.config,
      strict: true,
    });
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "object.required", path: [] }),
      };
    }

    if (!isObject(x)) {
      return {
        success: false,
        error: new TError({
          code: "object.type",
          path: [],
        }),
      };
    }

    if (this.config.strict && keys(x).length > keys(this.props).length) {
      return {
        success: false,
        error: new TError({
          code: "object.strict",
          path: [],
        }),
      };
    }

    let error: TError | undefined;

    const data: Dic = {};
    for (const k of keys(this.props)) {
      const schema = this.props[k];
      if (schema) {
        const result = schema.safeParse(x[k]);
        if (result.success) {
          data[k] = result.data;
        } else {
          error ??= new TError();
          error.merge(result.error, k);
        }
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
