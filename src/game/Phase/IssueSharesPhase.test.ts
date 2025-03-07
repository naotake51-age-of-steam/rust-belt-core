import { type Game, User, GameBuilder, IssueSharesPhase, Player, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { DeterminePlayerOrderPhase } from './DeterminePlayerOrderPhase'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('maxIssueShares', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 4, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as IssueSharesPhase

  expect(phase.maxIssueShares()).toBe(15 - 4)
})

test('canIssueShares 株式発行上限に達していない場合はTrue', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 14, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as IssueSharesPhase

  expect(phase.canIssueShares()).toBe(true)
})

test('canIssueShares 株式発行上限に達している場合はFalse', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 15, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as IssueSharesPhase

  expect(phase.canIssueShares()).toBe(false)
})

test('actionIssueShares', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as IssueSharesPhase

  const newGame = phase.actionIssueShares(2)

  expect(newGame.players[0].issuedShares).toBe(4)
  expect(newGame.players[0].money).toBe(20)
  expect(newGame.turnPlayer.id).toBe(1)
  expect(newGame.phase).toBeInstanceOf(IssueSharesPhase)
})

test('actionIssueShares 最終プレイヤーの場合は次のフェーズに進む', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())
    .setTurnPlayer(new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'))

  const phase = g.phase as IssueSharesPhase

  const newGame = phase.actionIssueShares(2)

  expect(newGame.turnPlayer.id).toBe(0)
  expect(newGame.phase).toBeInstanceOf(DeterminePlayerOrderPhase)
})

test('actionPassShares', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  const phase = g.phase as IssueSharesPhase

  const newGame = phase.actionPassShares()

  expect(newGame.players[0].issuedShares).toBe(2)
  expect(newGame.players[0].money).toBe(10)
  expect(newGame.turnPlayer.id).toBe(1)
  expect(newGame.phase).toBeInstanceOf(IssueSharesPhase)
})

test('actionPassShares 最終プレイヤーの場合は次のフェーズに進む', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
      new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 2, 2, 10, 0, 1),
      new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1)
    ])
    .setPhase(new IssueSharesPhase())
    .setTurnPlayer(new Player(2, '00000000-0000-0000-0000-000000000003', '佐藤三郎', '#000002', null, 3, 2, 10, 0, 1))

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000003', '佐藤三郎'))

  const phase = g.phase as IssueSharesPhase

  const newGame = phase.actionPassShares()

  expect(newGame.turnPlayer.id).toBe(0)
  expect(newGame.phase).toBeInstanceOf(DeterminePlayerOrderPhase)
})
