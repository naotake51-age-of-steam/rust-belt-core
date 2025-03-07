import { initializeGame } from 'initializeGame'

test('cloneDeep', function () {
  const g = initializeGame()
  expect(g.cloneDeep()).toEqual(g)
})
