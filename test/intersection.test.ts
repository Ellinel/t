import { test, expect, expectTypeOf } from "vitest";
import { t } from "../src";

test("types", () => {
  const o1 = t.object({ name: t.string() });
  const o2 = t.object({ age: t.number() });

  expectTypeOf(
    t.intersection(o1, o2).parse({
      name: "Petter",
      age: 13,
    })
  ).toEqualTypeOf<{
    name: string;
    age: number;
  }>();

  const u1 = t.union(t.string(), t.boolean());
  const u2 = t.union(t.string(), t.number());

  expectTypeOf(t.intersection(u1, u2).parse("str")).toEqualTypeOf<string>();
});

test("passing validations", () => {
  const o1 = t.object({ name: t.string() });
  const o2 = t.object({ age: t.number() });

  expect(
    t.intersection(o1, o2).parse({
      name: "Petter",
      age: 13,
    })
  ).toEqual({
    name: "Petter",
    age: 13,
  });

  const u1 = t.union(t.string(), t.boolean());
  const u2 = t.union(t.string(), t.number());

  expect(t.intersection(u1, u2).parse("str")).toBe("str");
});

test("failing validations", () => {
  const o1 = t.object({ name: t.string() });
  const o2 = t.object({ age: t.number() });
  const o3 = t.intersection(o1, o2);

  expect(() =>
    o3.parse({
      name: "Petter",
    })
  ).toThrow();

  const u1 = t.union(t.string(), t.boolean());
  const u2 = t.union(t.string(), t.number());
  const u3 = t.intersection(u1, u2);

  expect(() => u3.parse(true)).toThrow();
  expect(() => u3.parse(1)).toThrow();
});
