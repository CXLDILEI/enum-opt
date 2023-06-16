import { Options } from './opt';
/**
 * 根据选项的value查找label值
 * @param value 枚举值
 * @param options 选项
 */
export declare function valueToLabel(value: any, options: Options[]): string | null;
/**
 * 根据选项的label查找value值
 * @param label
 * @param options
 */
export declare function labelToValue(label: string, options: Options[]): number | null;
/**
 * 生成enum代码内容
 * @param source
 * @param optionSuffix
 * @returns {*}
 */
export declare function genCode(source: string, optionSuffix: string): string
