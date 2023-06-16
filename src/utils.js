import parser from "@babel/parser"
import {simplifyLabel, toLowerCaseFirstLetter} from "./hepler.js"
import traverse from '@babel/traverse'
import fs from "fs";
import path from "path";
import ejs from 'ejs'

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
    console.log('enum-opt: No matching in valueToLabel')
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
    console.log('enum-opt: No matching in labelToValue')
    return null
  }
}

function parserEnum(source, optionSuffix, config = {}) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    ranges: false,
    plugins: ['typescript']
  })
  const optionsData = []
  traverse(ast, {
    TSEnumDeclaration({ node }) {
      if (!inExclude(node.id.name, config)) {
        optionsData.push(
          {
            name: `${toLowerCaseFirstLetter(node.id.name)}${optionSuffix}`,
            options: getOptions(node.members, node.id.name),
            startLine: node.loc.start.line,
            sourceEnum: node.id.name,
            comments: findComments(ast.comments, node.loc.start.line)
          }
        )
      }
    },
  })
  return optionsData
}
/**
 * 判断枚举是否在 exclude中
 * @param str
 */
function inExclude(str, config) {
  return config.exclude?.some((item) => {
    if (isRegExp(item)) {
      return item.test(str)
    } else return str === item
  })
}
function isRegExp(v) {
  return Object.prototype.toString.call(v) === '[object RegExp]';
}
/**
 * 获取选项结构
 * @param members
 * @param name
 */
function getOptions(members, name) {
  return members.map((item) => {
    let label = ''
    if (Array.isArray(item.leadingComments)) {
      label = simplifyLabel(item.leadingComments[0].value)
    }
    const value = `${name}.${item.id.name}`
    return {
      label,
      value
    }
  })
}
/**
 * 查找注释
 * @param comments 注释数组
 * @param startLine
 */
function findComments(comments, startLine) {
  const node = comments.find((item) => {
    return item.loc.end.line === (startLine - 1)
  })
  if (node) {
    return simplifyLabel(node.value)
  } else return ''
}

/**
 * 生成enum代码内容
 * @param source
 * @param optionSuffix
 * @returns {*}
 */
function genCode(source, optionSuffix = 'Options') {
  const data = parserEnum(source, optionSuffix)
  const template = fs.readFileSync(path.resolve(__filename, '..', '..', 'template/content.ejs'), {
    encoding: "utf-8"
  })
  return ejs.render(template, { data })
}
export {
  valueToLabel,
  labelToValue,
  genCode,
  parserEnum
}
