import { $array } from "./schemas/array";
import { $boolean } from "./schemas/boolean";
import { $enum } from "./schemas/enum";
import { $function } from "./schemas/function";
import { $intersection } from "./schemas/intersection";
import { $literal } from "./schemas/literal";
import { $number } from "./schemas/number";
import { $object } from "./schemas/object";
import { $string } from "./schemas/string";
import { $union } from "./schemas/union";

export { Schema } from "./schemas/schema";
export type { Infer, ParseResult } from "./schemas/schema";
export { function_ as function, enum_ as enum };

export const number = $number.create;
export const boolean = $boolean.create;
export const string = $string.create;
export const object = $object.create;
export const literal = $literal.create;
export const array = $array.create;
export const union = $union.create;
export const intersection = $intersection.create;

const function_ = $function.create;
const enum_ = $enum.create;

