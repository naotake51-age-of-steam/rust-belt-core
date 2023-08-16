import { type Game, User, GameBuilder, Player, setContext, PayExpensesPhase, IncomeReductionPhase } from 'game'
import { initializeGame } from 'initializeGame'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  b = new GameBuilder(g)
})

test('prepare', () => {
  const income = 11

  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, income, 1)
    ])
    .setPhase(new PayExpensesPhase(''))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as PayExpensesPhase).executeDelay()

  expect(g.phase).toBeInstanceOf(IncomeReductionPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].income).toBe(income - 2)
  expect(g.phase.message).toBe('山田太郎さんは収入が2$減ります。（収入: 9$）')
})
