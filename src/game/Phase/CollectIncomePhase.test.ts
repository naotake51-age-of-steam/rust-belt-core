import { type Game, User, GameBuilder, Player, setContext, MoveGoodsPhase, CollectIncomePhase } from 'game'
import { initializeGame } from 'initializeGame'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  b = new GameBuilder(g)
})

test('prepare', () => {
  const money = 5
  const income = 10

  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, money, income, 1)
    ])
    .setPhase(new MoveGoodsPhase(null, [], 2, []))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as MoveGoodsPhase).actionPass()

  expect(g.phase).toBeInstanceOf(CollectIncomePhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(money + income)
  expect(g.phase.message).toBe('山田太郎さんは収入10$を得ます。（所持金: 15$）')
})
