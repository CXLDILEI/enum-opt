import { expect, test, describe } from 'vitest'
import { toLowerCaseFirstLetter, simplifyLabel } from "../src/hepler.js"

test('测试toLowerCaseFirstLetter', () => {
  expect(toLowerCaseFirstLetter('Add')).toBe('add')
})


describe('测试simplifyLabel', () => {
  test('空格', () => {
    expect(simplifyLabel(' 完善 ')).toBe('完善')
  })
  test('*号', () => {
    expect(simplifyLabel(' * 操作类型')).toBe('操作类型')
  })
})
