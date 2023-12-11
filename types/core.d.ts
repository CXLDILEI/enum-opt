import { OptionsAstItem } from "../types/opt";
/**
 * 生成enum代码内容
 * @param source
 * @param optionSuffix
 * @returns {*}
 */
declare function genCode(source: string, optionSuffix?: string): any;
declare function parserEnum(source: string, optionSuffix: any, config?: any): OptionsAstItem[];
export { parserEnum, genCode, };
