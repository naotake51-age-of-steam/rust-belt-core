import { type Game, User, GameBuilder, Player, setContext, CollectIncomePhase, PayExpensesPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare', () => {
  const money = 10
  const issuedShares = 4
  const engine = 2
  const income = 8

  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(money - issuedShares - engine)
  expect(g.phase.message).toBe('プレイヤーは支払いを行います。\n(支払いが足りない場合は収入が減ります。収入がマイナスになる場合はゲームから脱落します。)')
})

test('prepare 所持金が足りない場合は収入を減らす', () => {
  const money = 10
  const issuedShares = 7
  const engine = 5
  const income = 8

  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(0)
  expect(g.players[0].income).toBe(8 - 2)
  expect(g.players[0].alive).toBe(true)
  expect((g.phase as PayExpensesPhase).playerPayments[0].playerId).toBe(0)
  expect((g.phase as PayExpensesPhase).playerPayments[0].payment).toBe(12)
  expect((g.phase as PayExpensesPhase).playerPayments[0].reduceIncome).toBe(2)
  expect((g.phase as PayExpensesPhase).playerPayments[0].shortage).toBe(0)
})

test('prepare 所持金が足りない場合はエンジンを減らす 支払いが不可であればゲームから離脱する', () => {
  const money = 10
  const issuedShares = 7
  const engine = 5
  const income = 1

  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine)
    ])
    .setPhase(new CollectIncomePhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as CollectIncomePhase).executeDelay()

  expect(g.phase).toBeInstanceOf(PayExpensesPhase)
  expect(g.turnPlayer.id).toBe(0)
  expect(g.players[0].money).toBe(0)
  expect(g.players[0].income).toBe(0)
  expect(g.players[0].alive).toBe(false)
  expect((g.phase as PayExpensesPhase).playerPayments[0].playerId).toBe(0)
  expect((g.phase as PayExpensesPhase).playerPayments[0].payment).toBe(12)
  expect((g.phase as PayExpensesPhase).playerPayments[0].reduceIncome).toBe(2)
  expect((g.phase as PayExpensesPhase).playerPayments[0].shortage).toBe(1)
})
