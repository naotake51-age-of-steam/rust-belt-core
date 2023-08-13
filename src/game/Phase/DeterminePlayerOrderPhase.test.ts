import { Action } from 'enums'
import { type Game, User, GameBuilder, Player, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { DeterminePlayerOrderPhase, PlayerBid } from './DeterminePlayerOrderPhase'
import { SelectActionsPhase } from './SelectActionsPhase'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  b = new GameBuilder(g)
})

test('prepare', () => {
  g = b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', Action.ENGINEER, 3, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', Action.TURN_ORDER_PASS, 2, 2, 10)
    ])
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const newGame = DeterminePlayerOrderPhase.prepare(b).build()

  const phase = newGame.phase as DeterminePlayerOrderPhase

  expect(phase.playerBids[0].playerId).toBe(0)
  expect(phase.playerBids[0].money).toBe(0) // すべてのプレイヤーが0金からスタート
  expect(phase.playerBids[0].canSoftPass).toBe(false)
  expect(phase.playerBids[0].order).toBeNull() // orderは未決定なのでnull

  expect(phase.playerBids[1].playerId).toBe(2) // player.order順に並んでいること
  expect(phase.playerBids[1].money).toBe(0)
  expect(phase.playerBids[1].canSoftPass).toBe(true) // Action.TURN_ORDER_PASSのプレイヤーはcanSoftPassがtrue
  expect(phase.playerBids[1].order).toBeNull()

  expect(phase.playerBids[2].playerId).toBe(1)
  expect(phase.playerBids[2].money).toBe(0)
  expect(phase.playerBids[2].canSoftPass).toBe(false)
  expect(phase.playerBids[2].order).toBeNull()
})

test('minBids', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.minBids()).toBe(5 + 1)
})

test('maxBids', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 15),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.maxBids()).toBe(15)
})

test('canBids タープレイヤーが最低ビット金額を持っていたらTrue', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 6),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.canBids()).toBe(true)
})

test('canBids タープレイヤーが最低ビット金額を持っていなかったらFalse', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 5),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.canBids()).toBe(false)
})

test('actionBids', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 6),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionBids(6)

  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase.playerBids[0]).toEqual(new PlayerBid(0, 6, false, null))

  expect(newGame.turnPlayer.id).toBe(1) // 次のプレイヤーにターンが移る
})

test('actionBids 最低金額以下はビットできない', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 6),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(() => phase.actionBids(5)).toThrowError()
})

test('actionBids 所持金以上はビッドできない', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 6),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(() => phase.actionBids(7)).toThrowError()
})

test('canSoftPass パス権を持っていたらTrue', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, true, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.canSoftPass()).toBe(true)
})

test('canSoftPass パス権を持っていないならFalse', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  expect(phase.canSoftPass()).toBe(false)
})

test('actionSoftPass', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, true, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionSoftPass()
  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase.playerBids[0].canSoftPass).toBe(false) // 使用したのでFalseになる
  expect(newPhase.playerBids[0].money).toBe(3) // 変化しない
  expect(newGame.turnPlayer.id).toBe(1) // 次のプレイヤーにターンが移る
})

test('actionDropout 4人プレイヤー中の1番目のユーザーが降りた場合', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'),
      new User('00000000-0000-0000-0000-000000000004', '田中四郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10),
      new Player(3, '00000000-0000-0000-0000-000000000004', null, 4, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null),
      new PlayerBid(3, 0, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase).toBeInstanceOf(DeterminePlayerOrderPhase)

  expect(newPhase.playerBids[0].order).toBe(4) // 順序が決定する
  expect(newPhase.playerBids[0].money).toBe(3) // 変化しない
  expect(newGame.turnPlayer.id).toBe(1) // 次のプレイヤーにターンが移る
})

test('actionDropout 4人プレイヤー中の2番目のユーザーが降りた場合', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'),
      new User('00000000-0000-0000-0000-000000000004', '田中四郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10),
      new Player(3, '00000000-0000-0000-0000-000000000004', null, 4, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, 4),
      new PlayerBid(1, 4, false, null),
      new PlayerBid(2, 5, false, null),
      new PlayerBid(3, 0, false, null)
    ], ''))
    .setTurnPlayer(new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase).toBeInstanceOf(DeterminePlayerOrderPhase)

  expect(newPhase.playerBids[1].order).toBe(3) // 順序が決定する
  expect(newPhase.playerBids[1].money).toBe(4) // 変化しない
  expect(newGame.turnPlayer.id).toBe(2) // 次のプレイヤーにターンが移る
})

test('actionDropout 4人プレイヤー中の3番目のユーザーが降りた場合', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'),
      new User('00000000-0000-0000-0000-000000000004', '田中四郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10),
      new Player(3, '00000000-0000-0000-0000-000000000004', null, 4, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, 4),
      new PlayerBid(1, 5, false, 3),
      new PlayerBid(2, 6, false, null),
      new PlayerBid(3, 7, false, null)
    ], ''))
    .setTurnPlayer(new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as SelectActionsPhase

  expect(newPhase).toBeInstanceOf(SelectActionsPhase) // 次のフェーズに移る

  // 順序が決定する
  expect(newGame.players[0].order).toBe(4)
  expect(newGame.players[1].order).toBe(3)
  expect(newGame.players[2].order).toBe(2)
  expect(newGame.players[3].order).toBe(1)
  expect(newGame.turnPlayer.id).toBe(3) // 1番手がターンプレイヤーになる

  // 支払い金額
  expect(newGame.players[0].money).toBe(10 - 0) // 4番手: 0金払い
  expect(newGame.players[1].money).toBe(10 - 3) // 3番手: 半額の3金払い（繰上げ）
  expect(newGame.players[2].money).toBe(10 - 6) // 2番手: 全額の6金払い
  expect(newGame.players[3].money).toBe(10 - 7) // 1番手: 全額の7金払い
})

test('actionDropout 3人プレイヤー中の2番目のユーザーが降りた場合', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, 3),
      new PlayerBid(1, 5, false, null),
      new PlayerBid(2, 6, false, null)
    ], ''))
    .setTurnPlayer(new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as SelectActionsPhase

  expect(newPhase).toBeInstanceOf(SelectActionsPhase) // 次のフェーズに移る

  // 順序が決定する
  expect(newGame.players[0].order).toBe(3)
  expect(newGame.players[1].order).toBe(2)
  expect(newGame.players[2].order).toBe(1)
  expect(newGame.turnPlayer.id).toBe(2) // 1番手がターンプレイヤーになる

  // 支払い金額
  expect(newGame.players[0].money).toBe(10 - 0) // 3番手: 0金払い
  expect(newGame.players[1].money).toBe(10 - 5) // 2番手: 3人プレーの場合は2番手も全額
  expect(newGame.players[2].money).toBe(10 - 6) // 1番手: 全額の6金払い
})

test('actionDropout 次のプレイヤーがすでに降りている場合は、その次のプレイヤー手番がくる', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'),
      new User('00000000-0000-0000-0000-000000000004', '田中四郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 3, 2, 10),
      new Player(3, '00000000-0000-0000-0000-000000000004', null, 4, 2, 10)
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 5, false, 3),
      new PlayerBid(2, 6, false, null),
      new PlayerBid(3, 7, false, null)
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase).toBeInstanceOf(DeterminePlayerOrderPhase)

  expect(newGame.turnPlayer.id).toBe(2)
})

test('actionDropout 次のプレイヤーがすでに降りている場合は、その次のプレイヤー手番がくる（プレイヤーの順序がid順でないパターンも確認）', () => {
  b
    .setUsers([
      new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
      new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'),
      new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'),
      new User('00000000-0000-0000-0000-000000000004', '田中四郎')
    ])
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10),
      new Player(1, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10),
      new Player(2, '00000000-0000-0000-0000-000000000003', null, 4, 2, 10), // 4番手
      new Player(3, '00000000-0000-0000-0000-000000000004', null, 3, 2, 10) // 3番手
    ])
    .setPhase(new DeterminePlayerOrderPhase([
      new PlayerBid(0, 3, false, null),
      new PlayerBid(1, 5, false, 3),
      new PlayerBid(3, 7, false, null), // 3番手
      new PlayerBid(2, 6, false, null) // 4番手
    ], ''))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as DeterminePlayerOrderPhase

  const newGame = phase.actionDropout()
  const newPhase = newGame.phase as DeterminePlayerOrderPhase

  expect(newPhase).toBeInstanceOf(DeterminePlayerOrderPhase)

  expect(newGame.turnPlayer.id).toBe(3)
})
