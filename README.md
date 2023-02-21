

# enum-opt

typescript enum转换为选项

## 安装

### npm

```
npm install enum-opt --save
```

## 使用

```bash
npx enum-opt yourfile.ts
```

或在package.json中script添加脚本

```json
"scripts": {
	"enum-opt": "enum-opt"
}
```

```bash
npm run enum-opt
```

## 配置

在根目录下新增enumoptconfig.json或者.enumoptrc.js

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

| 参数         | 说明                                                         | 类型           | 默认值  |
| ------------ | ------------------------------------------------------------ | -------------- | ------- |
| entry        | 需要解析的枚举文件路径，多个文件可以使用对象配置             | string\|object | -       |
| outDir       | 输出的文件目录                                               | string         | ./      |
| fileSuffix   | 输出文件后缀，输出文件名为入口文件名+文件后缀（entry类型为object时无效） | string         | -opt    |
| optionSuffix | 输出选项变量后缀                                             | string         | Options |
| exclude      | 排除的枚举，排除的选项将不会生成                             | string         | -       |

## 示例

### 单个文件

enum.ts

```typescript
/**
 * 操作类型
 */
export enum ActionType {
  // 新增
  Add,
  // 编辑
  Edit,
  // 详情
  Detail,
  // 完善
  Perfect,
}
```

```bash
npx enum-opt enum.ts
```

```typescript
// @ts-ignore
import { ActionType } from 'enum'
/**
* 操作类型
*/
export const actionTypeOptions = [
  {
    label: '新增',
    value: ActionType.Add,
  },
  {
    label: '编辑',
    value: ActionType.Edit,
  },
  {
    label: '详情',
    value: ActionType.Detail,
  },
  {
    label: '完善',
    value: ActionType.Perfect,
  },
]
```

### 多个文件

enumoptconfig.json

```json
{
  "entry": {
    "enum-options": "enum.ts",
    "actions-options": "action-enum.ts"
  }
}
```

将会输出enum-options.ts和actions-options.ts

## 取值方法

```typescript
import { valueToLabel, labelToValue } from 'enum-opt'
import { actionTypeOptions } from './util/enum-opt'
import { ActionType } from './enum'

valueToLabel(ActionType.Add, actionTypeOptions) // 新增

labelToValue('新增', actionTypeOptions) // 1
```

## 注意

- 枚举注释应该在枚举值的上方,不然可能会导致生成失败