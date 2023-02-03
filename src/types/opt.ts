export interface Options {
  label: string,
  value: number
}
export interface OptionsAstItem {
  /**
   * 输出的文件名
   */
  name: string
  /**
   * 选项
   */
  options: Options
  /**
   * 起始行
   */
  startLine: number
  /**
   * 枚举
   */
  sourceEnum: string
  /**
   * 注释
   */
  comments: string
}
export interface ObjConfig {
  [key: string]: string
}
export interface Config {
  /**
   * 入口
   */
  entry: string | ObjConfig,
  /**
   * 输出目录
   */
  outDir: string
  /**
   * 输出文件后缀
   */
  fileSuffix: string
  /**
   * 输出选项后缀
   */
  optionSuffix: string
}
