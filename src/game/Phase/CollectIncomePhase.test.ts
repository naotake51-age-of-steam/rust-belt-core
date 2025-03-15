import { type Game, User, GameBuilder, Player, setContext, MoveGoodsPhase, CollectIncomePhase } from 'game'
import { initializeGame } from 'initializeGame'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare', () => {
  const money = 5
  const income = 10

  const player = new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, money, income, 1)

  g = b
    .setPlayers([player])
    .setTurnPlayer(player)
    .setPhase(new MoveGoodsPhase(null, [], 2, []))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as MoveGoodsPhase).actionPass()

  expect(g.phase).toBeInstanceOf(CollectIncomePhase)
  expect(g.turnPlayer).toBe(null)
  expect(g.players[0].money).toBe(money + income)
  expect(g.phase.message).toBe('プレイヤーは収入を受け取ります。')
})
