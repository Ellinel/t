import { TError } from "../error";
import type { Dic } from "../types";
import { isNumber, isObject, keys } from "../utils";
import { $base } from "./base";
import { type ParseResult, type Schema } from "./schema";

export type RecordConfig = {
  size?: number;
};

export class $record<T extends Dic> extends $base<T> {
  static create<T>(valueSchema: Schema<T>): $record<Dic<T>>;

  static create<U extends string | number | symbol, T>(
    keySchema: Schema<U>,
    valueSchema: Schema<T>,
  ): $record<{
    [K in U]: T;
  }>;

  static create(schema1: Schema, schema2?: Schema) {
    if (schema2) {
      return new $record(schema1, schema2);
    }
    return new $record(undefined, schema1);
  }

  private constructor(
    readonly keySchema: Schema | undefined,
    readonly valueSchema: Schema,
    private config: RecordConfig = {},
  ) {
    super();
  }

  size(size: number) {
    return new $record(this.keySchema, this.valueSchema, {
      ...this.config,
      size,
    });
  }

  safeParse(x: unknown): ParseResult<T> {
    if (x === undefined) {
      return {
        success: false,
        error: new TError({ code: "record.required", path: [] }),
      };
    }

    if (!isObject(x)) {
      return {
        success: false,
        error: new TError({
          code: "record.type",
          path: [],
        }),
      };
    }

    if (isNumber(this.config.size) && this.config.size !== keys(x).length) {
      return {
        success: false,
        error: new TError({
          code: "record.size",
          path: [],
        }),
      };
    }

    let error: TError | undefined;

    const data: Dic = {};
    for (const [key, value] of Object.entries(x)) {
      const result = this.valueSchema.safeParse(value);
      if (result.success) {
        data[key] = result.data;
      } else {
        error ??= new TError();
        error.merge(result.error, key);
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
