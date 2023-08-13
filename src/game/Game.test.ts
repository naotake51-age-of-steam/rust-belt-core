import { User } from 'game'
import { initializeGame } from 'initializeGame'

test('deepCopy', function () {
  const g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  expect(g.deepCopy()).toEqual(g)
})
