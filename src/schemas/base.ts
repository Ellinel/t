import { $array } from "./array";
import { $default } from "./default";
import { $nullable } from "./nullable";
import { $optional } from "./optional";
import { Schema } from "./schema";

export abstract class $base<T> extends Schema<T> {
  array(): $array<T> {
    return $array.create(this);
  }

  default(v: T): $default<T> {
    return $default.create(this, v);
  }

  optional(): $optional<T> {
    return $optional.create(this);
  }

  nullable(): $nullable<T> {
    return $nullable.create(this);
  }
}
