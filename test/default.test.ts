import { test, expect } from "vitest";
import { t } from "../src";

test("basic defaults", () => {
  expect(t.string().default("default").parse(undefined)).toBe("default");
});

test("default on existing optional", () => {
  const stringWithDefault = t.string().default("asdf");
  expect(stringWithDefault.parse(undefined)).toBe("asdf");
});

test("nested", () => {
  const inner = t.string().default("asdf");
  const outer = t.object({ inner }).default({
    inner: undefined as unknown as string,
  });

  expect(outer.parse(undefined)).toEqual({ inner: "asdf" });
  expect(outer.parse({})).toEqual({ inner: "asdf" });
  expect(outer.parse({ inner: undefined })).toEqual({ inner: "asdf" });
});

test("object enum", () => {
  enum Fruits {
    apple = "apple",
    orange = "orange",
  }

  const Meat = {
    poultry: "poultry",
    seafood: "seafood",
  } as const;

  const schema = t.object({
    fruit: t.enum(Fruits).default(Fruits.apple),
    meat: t.enum(Meat).default("seafood"),
  });

  expect(schema.parse({})).toEqual({
    fruit: Fruits.apple,
    meat: "seafood",
  });
});

test("array enum", () => {
  const schema = t.object({
    fruit: t.enum("apple", "orange").default("apple"),
    meat: t.enum(["poultry", "seafood"]).default("poultry"),
  });

  expect(schema.parse({})).toEqual({
    fruit: "apple",
    meat: "poultry",
  });
});
