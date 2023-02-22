/**
 * 转换为首字母小写
 * @param str
 */
export function toLowerCaseFirstLetter(str) {
  return str.substring(0, 1).toLocaleLowerCase() + str.substring(1)
}

/**
 * 处理label多余字符
 * @param label
 */
export function simplifyLabel(label) {
  return label.replace(/(\*|\r|\n|\s)/g, '')
}
