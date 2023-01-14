# @ellinel/t

A type safe validator

## Install

```sh
npm add @ellinel/t
```

## Example

```ts
import { t } from "@ellinel/t";

const schema = t.object({
  name: t.string(),
  age: t.number(),
  height: t.number().optional(),
});

type DateType = t.Infer<typeof schema>;
//     ^ { name:string, age: number, height?: number }

try {
  const data = schema.parse(/* ... */);
  //      ^ { name:string, age: number, height?: number }
} catch (error) {
  console.error(error);
}

const result = schema.safeParse(/* ... */);
if (result.success) {
  result.data;
  //       ^ { name:string, age: number, height?: number }
} else {
  result.error;
  //       ^ TError
}
```

## API

### t.string

### t.number

### t.boolean

### t.literal

### t.array

### t.tuple

### t.object

### t.record

### t.enum

### t.function

### t.instanceof

### t.union

### t.intersection

### t.any

### optional

### default
