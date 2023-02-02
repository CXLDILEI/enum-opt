export interface Options {
  label: string,
  value: number
}
export interface OptionsAstItem {
  name: string
  options: Options
  startLine: number
  sourceEnum: string
  comments: string
}
export interface ObjConfig {
  [key: string]: string
}
export interface Config {
  entry: string | ObjConfig,
  outDir: string
}
