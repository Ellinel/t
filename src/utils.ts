import { Dic } from "./types";

export function isObject(x: unknown): x is Dic {
  return x != null && typeof x === "object";
}

export function isNumber(x: unknown): x is number {
  return typeof x === "number" && !Number.isNaN(x);
}

export function keys<T extends Dic>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function includes(arr: unknown[], x: unknown) {
  return arr.includes(x);
}
