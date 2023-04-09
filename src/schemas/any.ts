import { $base } from "./base";
import { type ParseResult } from "./schema";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export class $any extends $base<any> {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  safeParse(x: unknown): ParseResult<any> {
    return {
      success: true,
      data: x,
    };
  }
}
