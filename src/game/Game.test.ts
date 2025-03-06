import { User } from 'game'
import { initializeGame } from 'initializeGame'

test('deepCopy', function () {
  const g = initializeGame()
  expect(g.deepCopy()).toEqual(g)
})
