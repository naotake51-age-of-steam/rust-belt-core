import { Action } from 'enums'
import { type Game, User, GameBuilder, Player, setContext, BuildTrackPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { SelectActionsPhase } from './SelectActionsPhase'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', Action.ENGINEER, 3, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', Action.TURN_ORDER_PASS, 2, 2, 10, 0, 1)
    ])
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const newGame = SelectActionsPhase.prepare(b).build()

  const phase = newGame.phase as SelectActionsPhase

  expect(phase).toBeInstanceOf(SelectActionsPhase)

  expect(newGame.players[0].selectedAction).toBeNull()
  expect(newGame.players[1].selectedAction).toBeNull()
  expect(newGame.players[2].selectedAction).toBeNull()
})

test('canSelectAction まだ選択されていないアクションならTrue', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', Action.ENGINEER, 3, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', Action.TURN_ORDER_PASS, 2, 2, 10, 0, 1)
    ])
    .setPhase(new SelectActionsPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as SelectActionsPhase

  expect(phase.canSelectAction(Action.LOCOMOTIVE)).toBe(true)
})

test('canSelectAction すでに選択されているアクションならFalse', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', Action.ENGINEER, 3, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', Action.TURN_ORDER_PASS, 2, 2, 10, 0, 1)
    ])
    .setPhase(new SelectActionsPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as SelectActionsPhase

  expect(phase.canSelectAction(Action.ENGINEER)).toBe(false)
})

test('actionSelectAction', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 2, 2, 10, 0, 1)
    ])
    .setPhase(new SelectActionsPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as SelectActionsPhase

  const newGame = phase.actionSelectAction(Action.LOCOMOTIVE)

  expect(newGame.players[0].selectedAction).toBe(Action.LOCOMOTIVE)
  expect(newGame.turnPlayer.id).toBe(2)
})

test('actionSelectAction 最終プレイヤーの場合は次のフェーズに進む', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', Action.ENGINEER, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', Action.FIRST_BUILD, 2, 2, 10, 0, 1)
    ])
    .setPhase(new SelectActionsPhase())
    .setTurnPlayer(new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000002', '鈴木二郎'))

  const phase = g.phase as SelectActionsPhase

  const newGame = phase.actionSelectAction(Action.LOCOMOTIVE)

  expect(newGame.players[1].selectedAction).toBe(Action.LOCOMOTIVE)
  expect(newGame.phase).toBeInstanceOf(BuildTrackPhase)
})
