import { Action } from 'enums'
import { type Game, User, GameBuilder, Player, setContext, IncomeReductionPhase, ProductionPhase, GoodsGrowthPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { getMapSpace, goodsCubes, goodsDisplayLines, s } from 'objects'
import { PlayerColor } from '../../enums/PlayerColor'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame()
  b = new GameBuilder(g)
})

test('prepare Productionを選択しているプレイヤーがいればProductionPhaseに遷移', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  expect(g.phase).toBeInstanceOf(ProductionPhase)
  expect(g.turnPlayer?.id).toBe(0)
})

test('prepare Productionを選択しているプレイヤーがいなければGoodsGrowthPhaseに遷移', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.ENGINEER, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
  expect(g.turnPlayer).toBe(null)
})

test('canProduceGoodsCubes/actionProduceGoodsCubes', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)
  expect((g.phase as ProductionPhase).canProduceGoodsCubes()).toBe(true)

  g = (g.phase as ProductionPhase).actionProduceGoodsCubes()

  expect((g.phase as ProductionPhase).canProduceGoodsCubes()).toBe(false)
  expect((g.phase as ProductionPhase).isExecuteProduction).toBe(true)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(2)
})

test('canPassProduction/actionProduceGoodsCubes', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)
  expect((g.phase as ProductionPhase).canPassProduction()).toBe(true)

  g = (g.phase as ProductionPhase).actionProduceGoodsCubes()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canPassProduction()).toBe(false)
  expect((g.phase as ProductionPhase).isExecuteProduction).toBe(true)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(2)
})

test('canPassProduction/actionPassProduction', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)
  expect((g.phase as ProductionPhase).canPassProduction()).toBe(true)

  g = (g.phase as ProductionPhase).actionPassProduction()

  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
})

test('canPlaceToGoodsDisplayLine/actionPlaceToGoodsDisplayLine/canCompleteProduction/actionCompleteProduction 商品を引いたら絶対に配置しないといけない', () => {
  g = b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))
    .build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)

  g = (g.phase as ProductionPhase).actionProduceGoodsCubes()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canCompleteProduction()).toBe(false)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(2)

  // 1個目の商品を配置
  const placingGoodsCubeIds = (g.phase as ProductionPhase).placingGoodsCubeIds
  expect((g.phase as ProductionPhase).canPlaceToGoodsDisplayLine(0)).toBe(true)
  g = (g.phase as ProductionPhase).actionPlaceToGoodsDisplayLine(0, placingGoodsCubeIds[0])
  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canCompleteProduction()).toBe(false)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(1)
  expect(goodsDisplayLines[0].goodsDisplaySpaces[0].goodsCube?.id).toBe(placingGoodsCubeIds[0])

  // 2個目の商品を配置
  expect((g.phase as ProductionPhase).canPlaceToGoodsDisplayLine(0)).toBe(true) // 説明書を見る限り、同じラインにも配置可能
  expect((g.phase as ProductionPhase).canPlaceToGoodsDisplayLine(1)).toBe(true)
  g = (g.phase as ProductionPhase).actionPlaceToGoodsDisplayLine(1, placingGoodsCubeIds[1])
  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canCompleteProduction()).toBe(true)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(0)
  expect(goodsDisplayLines[1].goodsDisplaySpaces[0].goodsCube?.id).toBe(placingGoodsCubeIds[1])

  // 完了
  g = (g.phase as ProductionPhase).actionCompleteProduction()
  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  expect(g.phase).toBeInstanceOf(GoodsGrowthPhase)
})

test('canCompleteProduction 商品ディスプレイが空いていない場合は配置しなくてよい', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))

  // 商品ディスプレイを満タンにする
  let goodsCubeId = 0
  goodsDisplayLines.forEach(goodsDisplayLine => {
    goodsDisplayLine.goodsDisplaySpaces.forEach(goodsDisplaySpace => {
      b.placeGoodsCubeToGoodsDisplaySpace(goodsCubes[goodsCubeId++], goodsDisplaySpace)
    })
  })

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)

  g = (g.phase as ProductionPhase).actionProduceGoodsCubes()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canCompleteProduction()).toBe(true) // 2個引いているが配置しなくてよい
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(2)
})

test('canCompleteProduction 商品が袋に残っていない場合は商品を補充できないのですぐに完了できる', () => {
  b
    .setPlayers([
      new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, Action.PRODUCTION, 1, 2, 10, 0, 1)
    ])
    .setPhase(new IncomeReductionPhase([]))

  // 商品すべてマップに配置する
  goodsCubes.forEach(goodsCube => {
    b.placeGoodsCubeToMapSpace(goodsCube, getMapSpace(s(1, 2)))
  })

  g = b.build()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  g = (g.phase as IncomeReductionPhase).executeDelay()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect(g.phase).toBeInstanceOf(ProductionPhase)

  g = (g.phase as ProductionPhase).actionProduceGoodsCubes()

  setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

  expect((g.phase as ProductionPhase).canCompleteProduction()).toBe(true)
  expect((g.phase as ProductionPhase).placingGoodsCubeIds.length).toBe(0)
})
