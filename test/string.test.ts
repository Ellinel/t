import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

const minFive = t.string().min(5);
const maxFive = t.string().max(5);
const justFive = t.string().length(5);
const nonempty = t.string().nonempty();
const startsWith = t.string().startsWith("startsWith");
const endsWith = t.string().endsWith("endsWith");

test("types", () => {
  expectTypeOf(t.string().parse("x")).toEqualTypeOf<string>();
});

test("passing validations", () => {
  expect(minFive.parse("12345")).toBe("12345");
  expect(minFive.parse("123456")).toBe("123456");
  expect(maxFive.parse("12345")).toBe("12345");
  expect(maxFive.parse("1234")).toBe("1234");
  expect(nonempty.parse("1")).toBe("1");
  expect(justFive.parse("12345")).toBe("12345");
  expect(startsWith.parse("startsWithX")).toBe("startsWithX");
  expect(endsWith.parse("XendsWith")).toBe("XendsWith");
});

test("failing validations", () => {
  expect(() => minFive.parse("1234")).toThrow();
  expect(() => maxFive.parse("123456")).toThrow();
  expect(() => nonempty.parse("")).toThrow();
  expect(() => justFive.parse("1234")).toThrow();
  expect(() => justFive.parse("123456")).toThrow();
  expect(() => startsWith.parse("x")).toThrow();
  expect(() => endsWith.parse("x")).toThrow();
});

test("regex", () => {
  expect(t.string().regex(/^moo+$/).parse("mooooo")).toBe("mooooo");
});

test("regex lastIndex reset", () => {
  const schema = t.string().regex(/^\d+$/g);
  expect(schema.safeParse("123").success).toEqual(true);
  expect(schema.safeParse("123").success).toEqual(true);
  expect(schema.safeParse("123").success).toEqual(true);
  expect(schema.safeParse("123").success).toEqual(true);
  expect(schema.safeParse("123").success).toEqual(true);
});
