import { Options } from './types/opt';
/**
 * 根据选项的value查找label值
 * @param value
 * @param options
 */
export declare function valueToLabel(value: any, options: Options[]): string | null;
/**
 * 根据选项的label查找value值
 * @param label
 * @param options
 */
export declare function labelToValue(label: any, options: Options[]): number | null;
