import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

test("types", () => {
  expectTypeOf(t.boolean().parse(true)).toEqualTypeOf<boolean>();
  expectTypeOf(t.boolean().parse(false)).toEqualTypeOf<boolean>();
});

test("passing validations", () => {
  expect(t.boolean().parse(true)).toBe(true);
  expect(t.boolean().parse(false)).toBe(false);
  expect(t.boolean().default(true).parse(undefined)).toBe(true);
  expect(t.boolean().default(false).parse(undefined)).toBe(false);
});

test("failing validations", () => {
  expect(() => t.boolean().parse(undefined)).toThrow();
  expect(() => t.boolean().parse(null)).toThrow();
  expect(() => t.boolean().parse("str")).toThrow();
  expect(() => t.boolean().parse(123)).toThrow();
  expect(() => t.boolean().parse([])).toThrow();
  expect(() => t.boolean().parse({})).toThrow();
  expect(() => t.boolean().parse(class A {})).toThrow();
  expect(() => t.boolean().parse(function a() {})).toThrow();
});

test("optional", () => {
  expect(t.boolean().optional().parse(undefined)).toEqual(undefined);
  expect(t.boolean().optional().parse(true)).toEqual(true);
  expect(t.boolean().optional().parse(false)).toEqual(false);
});
