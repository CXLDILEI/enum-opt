import { Options } from './types/opt'

/**
 * 根据选项的value查找label值
 * @param value 枚举值
 * @param options 选项
 */
export function valueToLabel(value, options: Options[]) {
  const data = options.find((item) => item.value === value)
  if (data) {
    return data.label
  } else {
    console.log('No matching')
    return null
  }
}

/**
 * 根据选项的label查找value值
 * @param label
 * @param options
 */
export function labelToValue(label: string, options: Options[]) {
  const data = options.find((item) => item.label === label)
  if (data) {
    return data.value
  } else {
    console.log('No matching')
    return null
  }
}
