import { TError } from "../error";

export type Infer<S> = S extends Schema<infer T> ? T : never;

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: TError };

export abstract class Schema<T = unknown> {
  abstract safeParse(x: unknown): ParseResult<T>;

  parse(x: unknown) {
    const result = this.safeParse(x);
    if (result.success) {
      return result.data;
    }
    throw result.error;
  }
}
