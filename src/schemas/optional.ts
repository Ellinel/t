import { $array } from "./array";
import { Schema, ParseResult } from "./schema";

export class $optional<T> extends Schema<T | undefined> {
  static create<T>(schema: Schema<T>) {
    return new $optional(schema);
  }

  private constructor(private schema: Schema<T>) {
    super();
  }

  safeParse(v: unknown): ParseResult<T | undefined> {
    if (v === undefined) {
      return {
        success: true,
        data: undefined,
      };
    }

    return this.schema.safeParse(v);
  }

  array(): $array<T | undefined> {
    return $array.create(this);
  }
}
