import { type Game, User, GameBuilder, Player, setContext, SettlementPhase, GoodsGrowthPhase, PlayerSettlement } from 'game'
import { initializeGame } from 'initializeGame'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare', () => {
  jest.mock('../../utility', () => ({
    random: (from: number, to: number) => 1
  }))

  const player = new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)

  g = b
    .setPlayers([
      player
    ])
    .setPhase(new SettlementPhase([
      new PlayerSettlement(
        player.id,
        false,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      )
    ]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as SettlementPhase).actionConfirm()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
})
