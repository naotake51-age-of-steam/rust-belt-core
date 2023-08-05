import { createUniqueIndex, createIndex } from './utility'

test('createUniqueIndex', function () {
  const items = [
    { k: 'a' },
    { k: 'b' },
    { k: 'c' }
  ]

  const index = createUniqueIndex(items, 'k')

  expect(index.get('a')).toBe(items[0])
  expect(index.get('b')).toBe(items[1])
  expect(index.get('c')).toBe(items[2])
})

test('createUniqueIndex duplicate value', function () {
  const items = [
    { k: 'a' },
    { k: 'a' }
  ]

  expect(() => createUniqueIndex(items, 'k')).toThrow()
})

test('createUniqueIndex null value', function () {
  const items = [
    { k: null },
    { k: null }
  ]

  const index = createUniqueIndex(items, 'k')

  expect(index.size).toBe(0)
})

test('createIndex', function () {
  const items = [
    { k: 'a' },
    { k: 'a' },
    { k: 'b' },
    { k: 'c' }
  ]

  const index = createIndex(items, 'k')

  expect(index.get('a')).toEqual([items[0], items[1]])
  expect(index.get('b')).toEqual([items[2]])
  expect(index.get('c')).toEqual([items[3]])
})

test('createIndex null value', function () {
  const items = [
    { k: null },
    { k: null }
  ]

  const index = createIndex(items, 'k')

  expect(index.size).toBe(0)
})
