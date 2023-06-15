English | [简体中文](./README-zh_CN.md)

# enum-opt

typescript enum Convert to an option data structure

## Install

### npm

```
npm install enum-opt --save
```

## Using

```bash
npx enum-opt yourfile.ts
```

Or add script in package.json script

```json
"scripts": {
  "enum-opt": "enum-opt"
}
```

```bash
npm run enum-opt
```

## Commands

| Command | Description           | Default |
| ------- | --------------------- | ------- |
| -o      | Output file directory | .       |

## Config

Add enumoptconfig.json or.enumoptrc.js to the root directory

enumoptconfig.json

```json
{
  "entry": "enum.ts"
}
```

 .enumoptrc.js

```js
module.exports = {
  entry: "enum.ts"
}
```

| Property         | Description                                                         | Type       | Default |
| ------------ | ------------------------------------------------------------ | -------------- | ------- |
| entry        | Enumeration file path to be parsed, multiple files can be configured using objects | string\|object | -       |
| outDir       | Output file directory                          | string         | ./      |
| fileSuffix   | The output file name is the entry file name + the file name suffix (invalid if the entry type is object). | string         | -opt    |
| optionSuffix | Output option variable suffix                | string         | Options |
| exclude      | Excluded enumeration, excluded options will not be generated | string         | -       |

## Example

### single file

enum.ts

```typescript
/**
 * action type
 */
export enum ActionType {
  // add
  Add,
  // edit
  Edit,
  // detail
  Detail,
  // perfect
  Perfect,
}
```

```bash
npx enum-opt enum.ts
```

generate enum-opt.ts

```typescript
// @ts-ignore
import { ActionType } from 'enum'
/**
* action type
*/
export const actionTypeOptions = [
  {
    label: 'add',
    value: ActionType.Add,
  },
  {
    label: 'edit',
    value: ActionType.Edit,
  },
  {
    label: 'detail',
    value: ActionType.Detail,
  },
  {
    label: 'perfect',
    value: ActionType.Perfect,
  },
]
```

### multiple file

enumoptconfig.json

```json
{
  "entry": {
    "enum-options": "enum.ts",
    "actions-options": "action-enum.ts"
  }
}
```

enum-options.ts and actions-options.ts will be printed

## Formatting

```typescript
import { valueToLabel, labelToValue } from 'enum-opt'
import { actionTypeOptions } from './util/enum-opt'
import { ActionType } from './enum'

valueToLabel(ActionType.Add, actionTypeOptions) // add

labelToValue('add', actionTypeOptions) // 1
```

## notice

- Enumeration comments should be above the enumeration value, otherwise the build may fail
