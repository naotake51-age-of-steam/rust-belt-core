import { type Game, User, GameBuilder, Player, setContext, IncomeReductionPhase, GoodsGrowthPhase } from 'game'
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

  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase(''))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
  expect(g.turnPlayer.id).toBe(0)
})
