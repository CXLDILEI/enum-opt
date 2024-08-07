// import "core-js/modules/es.array.find.js"
// import "core-js/modules/es.global-this.js"
// import "core-js/modules/es.object.get-own-property-descriptor.js"
/**
 * 根据选项的value查找label值
 * @param value 枚举值
 * @param options 选项
 */
function valueToLabel(value, options) {
  const data = options.find((item) => item.value === value)
  if (data) {
    return data.label
  } else {
    console.warn('enum-opt: No matching value in function valueToLabel')
    return null
  }
}

/**
 * 根据选项的label查找value值
 * @param label
 * @param options
 */
function labelToValue(label, options) {
  const data = options.find((item) => item.label === label)
  if (data) {
    return data.value
  } else {
    console.warn('enum-opt: No matching value in function labelToValue')
    return null
  }
}
export {
  valueToLabel,
  labelToValue,
}
