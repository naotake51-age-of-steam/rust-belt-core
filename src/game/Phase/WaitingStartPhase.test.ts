import { game, user, type Game, type User, GameBuilder, type WaitingStartPhase, IssueSharesPhase } from 'game'
import { initializeGame } from 'initializeGame'

let g: Game
let u: User
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', { id: '00000000-0000-0000-0000-000000000001', name: '山田太郎' })
  u = { id: '00000000-0000-0000-0000-000000000001', name: '山田太郎' }
  b = new GameBuilder(g)
})

test('canJoinUser ユーザーがまだ参加していない場合はTrue', () => {
  g = b.build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(true)
})

test('canJoinUser ユーザーがすでに参加している場合はFalse', () => {
  g = b.setUsers([u]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(false)
})

test('canJoinUser 参加上限に達している場合はFalse', () => {
  g = b.setUsers([
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' },
    { id: '00000000-0000-0000-0000-00000000000c', name: 'ユーザーC' },
    { id: '00000000-0000-0000-0000-00000000000d', name: 'ユーザーD' },
    { id: '00000000-0000-0000-0000-00000000000e', name: 'ユーザーE' },
    { id: '00000000-0000-0000-0000-00000000000f', name: 'ユーザーF' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canJoinUser()).toBe(false)
})

test('actionJoinUser', () => {
  g = b.build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.actionJoinUser().users).toEqual([u])
})

test('canRemoveUser ユーザーが参加している場合はTrue', () => {
  g = b.setUsers([u]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canRemoveUser()).toBe(true)
})

test('canRemoveUser ユーザーが参加していない場合はFalse', () => {
  g = b.setUsers([]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canRemoveUser()).toBe(false)
})

test('actionRemoveUser', () => {
  g = b.setUsers([u]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.actionRemoveUser().users).toEqual([])
})

test('canStartGame ユーザーがゲームに参加していない場合はFalse', () => {
  g = b.setUsers([
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' },
    { id: '00000000-0000-0000-0000-00000000000c', name: 'ユーザーC' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザーが下限に達していない場合はFalse', () => {
  g = b.setUsers([
    u,
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザーが下限に達している場合はTrue', () => {
  g = b.setUsers([
    u,
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(true)
})

test('canStartGame 参加ユーザー上限を超過している場合はFalse', () => {
  g = b.setUsers([
    u,
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' },
    { id: '00000000-0000-0000-0000-00000000000c', name: 'ユーザーC' },
    { id: '00000000-0000-0000-0000-00000000000d', name: 'ユーザーD' },
    { id: '00000000-0000-0000-0000-00000000000e', name: 'ユーザーE' },
    { id: '00000000-0000-0000-0000-00000000000f', name: 'ユーザーF' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(false)
})

test('canStartGame 参加ユーザー上限を超過していない場合はTrue', () => {
  g = b.setUsers([
    u,
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' },
    { id: '00000000-0000-0000-0000-00000000000c', name: 'ユーザーC' },
    { id: '00000000-0000-0000-0000-00000000000d', name: 'ユーザーD' },
    { id: '00000000-0000-0000-0000-00000000000e', name: 'ユーザーE' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  expect(phase.canStartGame()).toBe(true)
})
test('actionStartGame', () => {
  g = b.setUsers([
    u,
    { id: '00000000-0000-0000-0000-00000000000a', name: 'ユーザーA' },
    { id: '00000000-0000-0000-0000-00000000000b', name: 'ユーザーB' }
  ]).build()

  game(g)
  user(u)

  const phase = g.phase as WaitingStartPhase

  const newGame = phase.actionStartGame()

  expect(newGame.players.length).toBe(3) // 順番はシャッフルされる

  expect(newGame.phase).toBeInstanceOf(IssueSharesPhase)

  expect(newGame.goodsCubeStates.filter(_ => _.goodsDisplaySpace !== null).length).toBe(12 * 3 + 8 * 2)

  expect(newGame.goodsCubeStates.filter(_ => _.mapSpace !== null).length).toBe(12 * 2 + 2)
})
