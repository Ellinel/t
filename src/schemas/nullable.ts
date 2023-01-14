import { $array } from "./array";
import { ParseResult, Schema } from "./schema";

export class $nullable<T> extends Schema<T | null> {
  static create<T>(schema: Schema<T>) {
    return new $nullable(schema);
  }

  private constructor(private schema: Schema<T>) {
    super();
  }

  safeParse(v: unknown): ParseResult<T | null> {
    if (v === null) {
      return {
        success: true,
        data: null,
      };
    }
    return this.schema.safeParse(v);
  }

  array(): $array<T | null> {
    return $array.create(this);
  }
}
