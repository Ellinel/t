import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

test("types", () => {
  expectTypeOf(t.function().parse(function () {})).toEqualTypeOf<
    (...args: unknown[]) => unknown
  >();

  expectTypeOf(t.function().optional().parse(undefined)).toEqualTypeOf<
    ((...args: unknown[]) => unknown) | undefined
  >();
});

test("passing validations", () => {
  const f = () => {};
  const defaultFn = () => {};

  expect(t.function().parse(f)).toBe(f);
  expect(t.function().default(defaultFn).parse(f)).toBe(f);
  expect(t.function().default(defaultFn).parse(undefined)).toBe(defaultFn);
});

test("failing validations", () => {
  expect(() => t.function().parse(undefined)).toThrow();
  expect(() => t.function().parse(null)).toThrow();
  expect(() => t.function().parse("str")).toThrow();
  expect(() => t.function().parse(123)).toThrow();
  expect(() => t.function().parse([])).toThrow();
  expect(() => t.function().parse({})).toThrow();
  expect(() => t.function().parse(true)).toThrow();
  expect(() => t.function().parse(false)).toThrow();
});

test("length", () => {
  function with1params(_1) {}
  function with2params(_1, _2) {}
  function with0params() {}
  function withInfinityParams(..._params) {}

  expect(t.function().length(0).parse(withInfinityParams)).toBe(
    withInfinityParams
  );
  expect(t.function().length(0).parse(with0params)).toBe(with0params);
  expect(t.function().length(1).parse(with1params)).toBe(with1params);
  expect(t.function().length(2).parse(with2params)).toBe(with2params);

  expect(() => t.function().length(1).parse(withInfinityParams)).toThrow();
  expect(() => t.function().length(1).parse(with0params)).toThrow();
  expect(() => t.function().length(2).parse(with1params)).toThrow();
  expect(() => t.function().length(1).parse(with2params)).toThrow();
});
