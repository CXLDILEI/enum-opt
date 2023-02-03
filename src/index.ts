import typescript from 'typescript'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import fs from 'fs'
import ejs from 'ejs'
import path from "path"
import * as process from "process"
import { OptionsAstItem, Config } from './types/opt'
import { fileURLToPath } from "node:url"

let config: Config | undefined = undefined
const defaultOutDir = '.'
const defaultOptionSuffix = 'Options'
const defaultFileSuffix = '-opt'
const __filename = fileURLToPath(import.meta.url)

/**
 * 读取枚举文件创建ast
 * @param entry
 * @param optionSuffix
 */
function createAsset(entry: string, optionSuffix) {
  const enumPath = path.resolve(process.cwd(), entry)
  const source = fs.readFileSync(enumPath, {
    encoding: "utf-8"
  })
  const ast = parser.parse(source, {
    sourceType: 'module',
    ranges: false,
    plugins: ['typescript']
  })
  const optionsData: OptionsAstItem[] = []
  traverse.default(ast, {
    TSEnumDeclaration({ node }) {
      if (!inExclude(node.id.name)) {
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
 * 处理label多余字符
 * @param label
 */
function simplifyLabel(label: string) {
  return label.replace(/(\*|\r|\n|\s)/g, '')
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
 * 读取模板生成代码
 * @param data
 * @param fileName
 * @param enumPath
 */
function generate(data, fileName, enumPath) {
  const template = fs.readFileSync(path.resolve(__filename, '..', '..', 'template/options.ejs'), {
    encoding: "utf-8"
  })
  const outputPath = path.resolve(process.cwd(), mergeConfig(config).outDir, fileName)
  const code = ejs.render(template, { data, enumPath })
  fs.writeFileSync(outputPath, code, {
    encoding: "utf-8"
  })
  console.log('done:', outputPath)
}

/**
 * 转换为首字母小写
 * @param str
 */
function toLowerCaseFirstLetter(str) {
  return str.substring(0, 1).toLocaleLowerCase() + str.substring(1)
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
function readConfigFile(): Config {
  const jsonConfigPath = path.join(process.cwd(), 'enumoptconfig.json')
  const hasJsonConfig = fs.existsSync(jsonConfigPath)
  // const jsConfigPath = path.join(process.cwd(), '.enumoptrc.js')
  // const hasJSConfigPath = fs.existsSync(jsConfigPath)
  if (hasJsonConfig) {
    const configJson = fs.readFileSync(jsonConfigPath, {
      encoding: 'utf-8'
    })
    return JSON.parse(configJson)
  } else {
    return {
      entry: '',
      outDir: defaultOutDir,
      optionSuffix: defaultOptionSuffix,
      fileSuffix: defaultFileSuffix,
      exclude: [],
    }
  }
}

/**
 * 转换文件路径格式
 * @param path
 */
function transformToken(path) {
  return path.replace(/\\/g, '/').replace(/\.ts/, '')
}
function analysisConfig(config) {
  if (config.entry && typeof config.entry === "string") {
    const data = createAsset(config.entry, config.optionSuffix)
    const fileName = path.parse(config.entry).name
    const enumPath = transformToken(path.relative(config.outDir, config.entry))
    generate(data, `${fileName}${config.fileSuffix}.ts`, enumPath)
  } else if (config.entry && typeof config.entry === "object") {
    for (const key in config.entry) {
      const enumPath = transformToken(path.relative(config.outDir, config.entry[key]))
      const data = createAsset(config.entry[key], config.optionSuffix)
      generate(data, `${key}.ts`, enumPath)
    }
  } else {
    throw Error('The entry is missing')
  }
}
function mergeConfig(config): Config {
  const commands = process.argv.slice(2)
  const commandEntry = commands[0]
  if (commandEntry) {
    config.entry = commandEntry
  }
  config.outDir = config.outDir || defaultOutDir
  config.fileSuffix = config.fileSuffix || defaultFileSuffix
  config.optionSuffix = config.optionSuffix || defaultOptionSuffix
  return config
}
function isRegExp(v) {
  return Object.prototype.toString.call(v) === '[object RegExp]';
}

/**
 * 判断枚举是否在 exclude中
 * @param str
 */
function inExclude(str: string) {
  return mergeConfig(config).exclude.some((item) => {
    if (isRegExp(item)) {
      return item.test(str)
    } else return str === item
  })
}
function main() {
  config = readConfigFile()
  analysisConfig(mergeConfig(config))
}
main()
