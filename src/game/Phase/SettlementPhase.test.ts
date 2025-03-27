import { type Game, User, GameBuilder, Player, setContext, MoveGoodsPhase, SettlementPhase, PlayerSettlement, GoodsGrowthPhase, UnderpaymentPhase } from 'game'
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
  expect((g.phase as SettlementPhase).playerSettlements[0].confirm).toBe(false)
  expect((g.phase as SettlementPhase).playerSettlements[0].money).toBe(10)
  expect((g.phase as SettlementPhase).playerSettlements[0].income).toBe(8)
  expect((g.phase as SettlementPhase).playerSettlements[0].afterMoneyByIncome).toBe(18)
  expect((g.phase as SettlementPhase).playerSettlements[0].payment).toBe(6)
  expect((g.phase as SettlementPhase).playerSettlements[0].afterMoneyByPayment).toBe(12)
  expect((g.phase as SettlementPhase).playerSettlements[0].reduceIncome).toBe(0)
  expect((g.phase as SettlementPhase).playerSettlements[0].afterIncome).toBe(8)
  expect(g.players[0].money).toBe(12)
  expect(g.players[0].income).toBe(8)
  expect(g.players[0].alive).toBe(true)
  expect(g.phase.message).toBe('各プレイヤーの決算を行いました。')
})

test('actionConfirm', () => {
  const players = [
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 0, 0, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 0, 0, 0, 1)
  ]

  g = b
    .setPlayers(players)
    .setTurnPlayer(players[0])
    .setPhase(new SettlementPhase([
      new PlayerSettlement(players[0].id, false, 0, 0, 0, 0, 0, 0, 0),
      new PlayerSettlement(players[1].id, false, 0, 0, 0, 0, 0, 0, 0)
    ]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as SettlementPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
  expect(g.turnPlayer).toBe(null)
})

test('actionConfirm 支払いが足りないプレイヤーがいる場合はUnderpaymentPhaseへ', () => {
  const players = [
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 0, 0, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 0, 0, 0, 1)
  ]

  g = b
    .setPlayers(players)
    .setTurnPlayer(players[0])
    .setPhase(new SettlementPhase([
      new PlayerSettlement(players[0].id, false, 0, 0, 0, 0, 0, 0, 0),
      new PlayerSettlement(players[1].id, false, 0, 0, 0, 0, -1, 0, 0)
    ]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as SettlementPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(UnderpaymentPhase)
  expect(g.turnPlayer).toBe(null)
})
