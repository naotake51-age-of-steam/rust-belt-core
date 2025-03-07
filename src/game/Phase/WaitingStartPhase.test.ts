import { setContext, type Game, User, GameBuilder, type WaitingStartPhase, IssueSharesPhase, Player } from 'game'
import { initializeGame } from 'initializeGame'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let u: User
let b: GameBuilder

beforeEach(() => {
  u = new User('00000000-0000-0000-0000-000000000000', '山田太郎')
  g = initializeGame()
  b = new GameBuilder(g)
})

test('canJoinUser ユーザーがまだ参加していない場合はTrue', () => {
  g = b.build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(true)
})

test('canJoinUser ユーザーがすでに参加している場合はFalse', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.RED, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(false)
})

test('canJoinUser 参加上限に達している場合はFalse', () => {
  g = b.setPlayers([
    new Player(0, '00000000-0000-0000-0000-000000000001', 'ユーザー1', PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000004', 'ユーザー4', PlayerColor.PINK, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000005', 'ユーザー5', PlayerColor.GRAY, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000006', 'ユーザー6', PlayerColor.ORANGE, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(false)
})

test('actionJoinUser', () => {
  g = b.build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.actionJoinUser(PlayerColor.RED).players[0].uid).toEqual(u.id)
})

test('canRemoveUser ユーザーが参加している場合はTrue', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.RED, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canRemoveUser()).toBe(true)
})

test('canRemoveUser ユーザーが参加していない場合はFalse', () => {
  g = b.setPlayers([]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canRemoveUser()).toBe(false)
})

test('actionRemoveUser', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.RED, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.actionRemoveUser().players).toEqual([])
})

test('canStartGame ユーザーがゲームに参加していない場合はFalse', () => {
  g = b.setPlayers([
    new Player(0, '00000000-0000-0000-0000-000000000001', 'ユーザー1', PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザーが下限に達していない場合はFalse', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザーが下限に達している場合はTrue', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(true)
})

test('canStartGame 参加ユーザー上限を超過している場合はFalse', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000004', 'ユーザー4', PlayerColor.PINK, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000005', 'ユーザー5', PlayerColor.GRAY, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000006', 'ユーザー6', PlayerColor.ORANGE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000007', 'ユーザー7', PlayerColor.ORANGE, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザー上限を超過していない場合はTrue', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000004', 'ユーザー4', PlayerColor.PINK, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000005', 'ユーザー5', PlayerColor.GRAY, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000007', 'ユーザー7', PlayerColor.ORANGE, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(true)
})
test('actionStartGame', () => {
  g = b.setPlayers([
    new Player(0, u.id, u.name, PlayerColor.BLUE, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000002', 'ユーザー2', PlayerColor.GREEN, null, 1, 2, 10, 0, 1),
    new Player(0, '00000000-0000-0000-0000-000000000003', 'ユーザー3', PlayerColor.YELLOW, null, 1, 2, 10, 0, 1)
  ]).build()

  setContext(g, u)

  const phase = g.phase as WaitingStartPhase

  const newGame = phase.actionStartGame()

  expect(newGame.players.length).toBe(3)

  expect(newGame.phase).toBeInstanceOf(IssueSharesPhase)

  expect(newGame.goodsCubeStates.filter(_ => _.goodsDisplaySpace !== null).length).toBe(12 * 3 + 8 * 2)

  expect(newGame.goodsCubeStates.filter(_ => _.mapSpace !== null).length).toBe(12 * 2 + 2)
})
