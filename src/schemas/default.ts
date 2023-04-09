import make from "rfdc";
import { $array } from "./array";
import { Schema, type ParseResult } from "./schema";

const clone = make();

export class $default<T> extends Schema<T> {
  static create<T>(schema: Schema<T>, defaultValue: T) {
    return new $default(schema, defaultValue);
  }

  private constructor(private schema: Schema<T>, private defaultValue: T) {
    super();
  }

  safeParse(v: unknown): ParseResult<T> {
    if (v == null) {
      return this.schema.safeParse(clone(this.defaultValue));
    }

    return this.schema.safeParse(v);
  }

  array(): $array<T> {
    return $array.create(this);
  }
}
