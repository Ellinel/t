import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

test("types", () => {
  const constObj = { a: "A", b: "B", c: "C" } as const;
  expectTypeOf(t.enum(constObj).parse("A")).toEqualTypeOf<"A" | "B" | "C">();

  const constArr = ["a", "b", "c"] as const;
  expectTypeOf(t.enum(constArr).parse("a")).toEqualTypeOf<"a" | "b" | "c">();

  enum nativeEnum {
    a,
    b,
    c,
  }
  expectTypeOf(t.enum(nativeEnum).parse(nativeEnum.a)).toEqualTypeOf<nativeEnum>();
});

test("infer enum", () => {
  const MyEnum = t.enum(["Red", "Green", "Blue"]);
  const x = {} as t.Infer<typeof MyEnum>;
  expectTypeOf(x).toEqualTypeOf<"Red" | "Green" | "Blue">();
});

test("readonly enum", () => {
  const HTTP_SUCCESS = ["200", "201"] as const;
  const schema = t.enum(HTTP_SUCCESS);

  expect(schema.parse("201")).toBe("201");
  expect(() => schema.parse("202")).toThrow();
});
