import { type Game, User, GameBuilder, Player, setContext, MoveGoodsPhase, SettlementPhase, UnderpaymentPhase, PlayerUnderpayment, GoodsGrowthPhase, EndGamePhase } from 'game'
import { initializeGame } from 'initializeGame'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare', () => {
  const money = 3
  const issuedShares = 4
  const engine = 2
  const income = 2

  const player = new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine)

  g = b
    .setPlayers([
      player
    ])
    .setTurnPlayer(player)
    .setPhase(new MoveGoodsPhase(null, [], 2, []))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as MoveGoodsPhase).actionPass()

  expect(g.phase).toBeInstanceOf(SettlementPhase)
  expect(g.turnPlayer).toBe(null)
  expect((g.phase as SettlementPhase).playerSettlements[0].afterMoneyByPayment).toBe(-1)
  expect(g.players[0].money).toBe(-1)

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as SettlementPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(UnderpaymentPhase)
  expect(g.turnPlayer).toBe(null)
  expect((g.phase as UnderpaymentPhase).playerUnderpayments[0].income).toBe(2)
  expect((g.phase as UnderpaymentPhase).playerUnderpayments[0].reduceIncome).toBe(1)
  expect((g.phase as UnderpaymentPhase).playerUnderpayments[0].afterIncome).toBe(1)
  expect(g.players[0].money).toBe(0)
  expect(g.players[0].income).toBe(1)
  expect(g.players[0].alive).toBe(true)
})

test('actionConfirm', () => {
  const money = 3
  const issuedShares = 4
  const engine = 2
  const income = 2

  const players = [
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine),
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine)
  ]

  g = b
    .setPlayers(players)
    .setTurnPlayer(players[0])
    .setPhase(new UnderpaymentPhase([
      new PlayerUnderpayment(players[0].id, false, 2, 1, 1, true),
      new PlayerUnderpayment(players[1].id, true, 2, 1, 1, true)
    ]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as UnderpaymentPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
  expect(g.turnPlayer).toBe(null)
})

test('actionConfirm 生存プレイヤーが１人以下の場合はゲーム終了', () => {
  const money = 3
  const issuedShares = 4
  const engine = 2
  const income = 2

  const players = [
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine),
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, issuedShares, money, income, engine, false)
  ]

  g = b
    .setPlayers(players)
    .setTurnPlayer(players[0])
    .setPhase(new UnderpaymentPhase([
      new PlayerUnderpayment(players[0].id, false, 2, 1, 1, true),
      new PlayerUnderpayment(players[1].id, true, 2, 1, -1, false)
    ]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as UnderpaymentPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(EndGamePhase)
  expect(g.turnPlayer).toBe(null)
})
