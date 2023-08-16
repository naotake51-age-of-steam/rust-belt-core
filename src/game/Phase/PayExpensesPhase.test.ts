import { type Game, User, GameBuilder, Player, setContext, CollectIncomePhase, PayExpensesPhase } from 'game'
import { initializeGame } from 'initializeGame'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  b = new GameBuilder(g)
})

test('prepare', () => {
  const money = 10
  const issuedShares = 4
  const engine = 2
  const income = 8

  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase(''))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(money - issuedShares - engine)
  expect(g.phase.message).toBe('山田太郎さんは6$を支払います。（所持金: 4$）')
})

test('prepare 所持金が足りない場合は収入を減らす', () => {
  const money = 10
  const issuedShares = 7
  const engine = 5
  const income = 8

  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase(''))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(0)
  expect(g.players[0].income).toBe(8 - 2)
  expect(g.phase.message).toBe('山田太郎さんは12$を支払います。（所持金: 0$） 収入を2$減らします。（収入: 6$）')
})

test('prepare 所持金が足りない場合はエンジンを減らす 支払いが不可であればゲームから離脱する', () => {
  const money = 10
  const issuedShares = 7
  const engine = 5
  const income = 1

  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase(''))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(0)
  expect(g.players[0].income).toBe(0)
  expect(g.phase.message).toBe('山田太郎さんは12$を支払います。（所持金: 0$） 収入を2$減らします。（収入: 0$） 支払いコストが1$足りません。ゲームから離脱します。')
})
