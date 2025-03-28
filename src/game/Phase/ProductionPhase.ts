import { Action, PhaseId } from 'enums'
import { type Game, context, type Player } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type GoodsCube, clothBag, goodsCubes, goodsDisplayLines } from 'objects'
import { GoodsGrowthPhase } from './GoodsGrowthPhase'
import { Phase } from './Phase'

export class ProductionPhase extends Phase {
  public readonly id = PhaseId.PRODUCTION

  constructor (
    public readonly playerId: number,
    public readonly isExecuteProduction: boolean, // 商品を引いたら絶対に配置しないといけないらしい
    public readonly placingGoodsCubeIds: number[] // 商品が残っていない可能性があるので[number, number]とはしない。
  ) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.persist()

    const productionPlayer = b.game.alivePlayers.find(_ => _.action === Action.PRODUCTION)
    if (productionPlayer !== undefined) {
      b.setPhase(new ProductionPhase(productionPlayer.id, false, []))
      b.setTurnPlayer(productionPlayer)
    } else {
      GoodsGrowthPhase.prepare(b)
    }

    return b
  }

  public get message (): string {
    return `${this.player.name}さんは商品補充アクションを行ってください。`
  }

  public get player (): Player {
    const { g } = context()
    return g.getPlayer(this.playerId)
  }

  public isTurnPlayer (): boolean {
    const { p } = context()

    return p?.hasTurn ?? false
  }

  public get placingGoodsCubes (): GoodsCube[] {
    if (this.placingGoodsCubeIds === null) return []

    return this.placingGoodsCubeIds.map(_ => goodsCubes[_])
  }

  public canProduceGoodsCubes (): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return !this.isExecuteProduction
  }

  public actionProduceGoodsCubes (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canProduceGoodsCubes()) throw new Error('cannot produce goods cubes')

    const b = new GameBuilder(g)

    const randomGoodsCubes = clothBag.getRandomGoodsCubes(2)
    b.setPhase(new ProductionPhase(this.playerId, true, randomGoodsCubes.map(_ => _.id)))

    return b.build()
  }

  public canPlaceToGoodsDisplayLine (goodsDisplayLineId: number): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (this.placingGoodsCubes.length === 0) return false

    const goodsDisplayLine = goodsDisplayLines[goodsDisplayLineId]

    return goodsDisplayLine.nextEmptySpace !== null
  }

  public actionPlaceToGoodsDisplayLine (goodsDisplayLineId: number, goodsCubeId: number): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canPlaceToGoodsDisplayLine(goodsDisplayLineId)) throw new Error('cannot place to goods display space')

    if (!this.placingGoodsCubeIds.includes(goodsCubeId)) throw new Error('goods cube is not in placing goods cubes')

    const goodsDisplayLine = goodsDisplayLines[goodsDisplayLineId]

    const b = new GameBuilder(g)

    const nextEmptySpace = goodsDisplayLine.nextEmptySpace
    if (nextEmptySpace === null) throw new Error('logic error')

    b.placeGoodsCubeToGoodsDisplaySpace(goodsCubes[goodsCubeId], nextEmptySpace)

    b.setPhase(new ProductionPhase(
      this.playerId,
      this.isExecuteProduction,
      this.placingGoodsCubeIds.filter(_ => _ !== goodsCubeId)
    ))

    return b.build()
  }

  public canPassProduction (): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    // 商品を引いたらもうパスはできない。
    return !this.isExecuteProduction
  }

  public actionPassProduction (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canPassProduction()) throw new Error('cannot pass production')

    const b = new GameBuilder(g)

    GoodsGrowthPhase.prepare(b)

    return b.build()
  }

  public canCompleteProduction (): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.isExecuteProduction) return false

    // 基本的に一度引いたら商品はすべて配置しないといけないが、スペースがない場合は完了できる。
    return this.placingGoodsCubes.length === 0 || goodsDisplayLines.every(_ => _.goodsDisplaySpaces[0].goodsCube !== null)
  }

  public actionCompleteProduction (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canCompleteProduction()) throw new Error('cannot pass production')

    const b = new GameBuilder(g)

    GoodsGrowthPhase.prepare(b)

    return b.build()
  }
}
