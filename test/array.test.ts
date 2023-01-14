import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

const minTwo = t.string().array().min(2);
const maxTwo = t.string().array().max(2);
const justTwo = t.string().array().length(2);
const intNum = t.string().array().nonempty();
const nonEmptyMax = t.string().array().nonempty().max(2);

test("types", () => {
  expectTypeOf(t.string().array().parse([])).toEqualTypeOf<string[]>();
  expectTypeOf(t.array(t.string()).parse([])).toEqualTypeOf<string[]>();

  expectTypeOf(t.number().array().parse([])).toEqualTypeOf<number[]>();
  expectTypeOf(t.array(t.number()).parse([])).toEqualTypeOf<number[]>();

  expectTypeOf(t.boolean().array().parse([])).toEqualTypeOf<boolean[]>();
  expectTypeOf(t.array(t.boolean()).parse([])).toEqualTypeOf<boolean[]>();

  expectTypeOf(t.literal(1).array().parse([])).toEqualTypeOf<1[]>();
  expectTypeOf(t.array(t.literal(1)).parse([])).toEqualTypeOf<1[]>();
});

test("passing validations", () => {
  expect(minTwo.parse(["a", "a"])).toEqual(["a", "a"]);
  expect(minTwo.parse(["a", "a", "a"])).toEqual(["a", "a", "a"]);
  expect(maxTwo.parse(["a", "a"])).toEqual(["a", "a"]);
  expect(maxTwo.parse(["a"])).toEqual(["a"]);
  expect(justTwo.parse(["a", "a"])).toEqual(["a", "a"]);
  expect(intNum.parse(["a"])).toEqual(["a"]);
  expect(nonEmptyMax.parse(["a"])).toEqual(["a"]);
});

test("failing validations", () => {
  expect(() => minTwo.parse(["a"])).toThrow();
  expect(() => maxTwo.parse(["a", "a", "a"])).toThrow();
  expect(() => justTwo.parse(["a"])).toThrow();
  expect(() => justTwo.parse(["a", "a", "a"])).toThrow();
  expect(() => intNum.parse([])).toThrow();
  expect(() => nonEmptyMax.parse([])).toThrow();
  expect(() => nonEmptyMax.parse(["a", "a", "a"])).toThrow();
});

test("parse empty array in nonempty", () => {
  expect(() => t.array(t.string()).nonempty().parse([])).toThrow();
});

test("get element", () => {
  justTwo.element.parse("asdf");
  expect(() => justTwo.element.parse(12)).toThrow();
});

test("continue parsing despite array size error", () => {
  const schema = t.object({
    people: t.string().array().min(2),
  });

  const result = schema.safeParse({
    people: [123],
  });
  expect(result.success).toEqual(false);
});

test("parse should fail given sparse array", () => {
  const schema = t.array(t.string()).nonempty().min(1).max(3);

  expect(() => schema.parse(new Array(3))).toThrow();
});
