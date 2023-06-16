import fs from 'fs'
import ejs from 'ejs'
import path from "path"
import * as process from "process"
import { Config } from '../types/opt'
import { fileURLToPath } from "node:url"
import { createRequire } from 'node:module';
import { parserEnum } from './utils.js'

let config: Config = {
  entry: '',
  outDir: '',
  fileSuffix: '',
  optionSuffix: '',
  exclude: []
}
const defaultOutDir = '.'
const defaultOptionSuffix = 'Options'
const defaultFileSuffix = '-opt'
const __filename = fileURLToPath(import.meta.url)
const require = createRequire(import.meta.url);

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
  return parserEnum(source, optionSuffix)
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
  const outputPath = path.resolve(process.cwd(), config.outDir, fileName)
  const code = ejs.render(template, { data, enumPath })
  fs.writeFileSync(outputPath, code, {
    encoding: "utf-8"
  })
  console.log('done:', outputPath)
}

function readConfigFile(): Config {
  const jsonConfigPath = path.join(process.cwd(), 'enumoptconfig.json')
  const hasJsonConfig = fs.existsSync(jsonConfigPath)
  const jsConfigPath = path.join(process.cwd(), '.enumoptrc.js')
  const hasJSConfigPath = fs.existsSync(jsConfigPath)
  if (hasJsonConfig) {
    const configJson = fs.readFileSync(jsonConfigPath, {
      encoding: 'utf-8'
    })
    return JSON.parse(configJson)
  } else if (hasJSConfigPath) {
    const jsConfig = require(jsConfigPath)
    return jsConfig
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
 * @param p
 */
function transformPathToken(p) {
  const tempPath = p.split(path.sep).join('/').replace('.ts', '')
  if (path.dirname(p) === '.') {
    return './' + tempPath
  }
  return tempPath
}
function analysisConfig() {
  if (config.entry && typeof config.entry === "string") {
    const data = createAsset(config.entry, config.optionSuffix)
    const fileName = path.parse(config.entry).name
    const enumPath = transformPathToken(path.relative(config.outDir, config.entry))
    generate(data, `${fileName}${config.fileSuffix}.ts`, enumPath)
  } else if (config.entry && typeof config.entry === "object") {
    for (const key in config.entry) {
      const enumPath = transformPathToken(path.relative(config.outDir, config.entry[key]))
      const data = createAsset(config.entry[key], config.optionSuffix)
      generate(data, `${key}.ts`, enumPath)
    }
  } else {
    throw Error('The entry is missing')
  }
}
function mergeConfig(): Config {
  config.outDir = config.outDir || defaultOutDir
  config.fileSuffix = config.fileSuffix || defaultFileSuffix
  config.optionSuffix = config.optionSuffix || defaultOptionSuffix
  config.exclude = config.exclude || []
  return config
}
function analyzeCommands() {
  const commands = process.argv.slice(2)
  const commandEntry = commands[0]
  if (commandEntry) {
    config.entry = commandEntry
  }
  if (commands.includes('-o')) {
    const outDirIndex = commands.indexOf('-o') + 1
    config.outDir = commands[outDirIndex]
  }
}
function main() {
  config = readConfigFile()
  mergeConfig()
  analyzeCommands()
  analysisConfig()
}
main()
