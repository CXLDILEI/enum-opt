import { expect, test } from 'vitest'
import { labelToValue, valueToLabel, genCode } from '../src/utils'

enum ActionsType {
	// 新增
	Add,
	// 编辑
	Edit,
	// 详情
	Detail,
	// 完善
	Perfect,
}

const testOptions = [
	{
		label: '新增',
		value: ActionsType.Add,
	},
	{
		label: '编辑',
		value: ActionsType.Edit,
	},
	{
		label: '详情',
		value: ActionsType.Detail,
	},
	{
		label: '完善',
		value: ActionsType.Perfect,
	},
]
const source = `/**
 * 操作类型
 */
export enum ActionsType {
  // 新增
  Add,
  // 编辑
  Edit,
  // 详情
  Detail,
  // 完善
  Perfect,
}`
test('测试valueToLabel函数', () => {
	expect(valueToLabel(ActionsType.Add, testOptions)).toBe('新增')
})
test('测试labelToValue函数', () => {
	expect(labelToValue('新增', testOptions)).toBe(ActionsType.Add)
})
test('测试genCode函数', () => {
	expect(genCode(source)).toBeDefined()
})
