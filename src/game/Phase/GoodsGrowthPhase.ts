import { PhaseId } from 'enums'
import { context } from 'game'
import { type Game } from 'game/Game'
import { GameBuilder } from 'game/GameBuilder'
import { type GoodsDisplay, goodsDisplayBlack, goodsDisplayWhite } from 'objects'
import { random, range } from 'utility'
import { AdvanceTurnMarkerPhase } from './AdvanceTurnMarkerPhase'
import { Phase, type HasDelayExecute } from './Phase'

export class GoodsGrowthPhase extends Phase implements HasDelayExecute {
  public readonly id = PhaseId.GOODS_GROWTH

  public constructor (
    public readonly message: string
  ) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const whiteDices = b.game.players.map(_ => random(1, 6))// プレイヤー数だけダイスを振る
    this.growGoodsCubes(goodsDisplayWhite, whiteDices, b)

    const blackDices = b.game.players.map(_ => random(1, 6))// プレイヤー数だけダイスを振る
    this.growGoodsCubes(goodsDisplayBlack, blackDices, b)

    const message = [
      '以下のダイス目の商品を補充します。',
      '白: ' + whiteDices.map(_ => _.toString).join('、'),
      '黒: ' + blackDices.map(_ => _.toString).join('、')
    ].join('\n')

    b.setPhase(new GoodsGrowthPhase(message))

    return b
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    AdvanceTurnMarkerPhase.prepare(b)

    return b.build()
  }

  private static growGoodsCubes (goodsDisplay: GoodsDisplay, dices: number[], b: GameBuilder): GameBuilder {
    range(1, 6).forEach((dice: number) => {
      const grows = dices.filter(_ => _ === dice).length
      if (grows > 0) {
        goodsDisplay.getGoodsDisplayLinesByDice(dice).forEach(goodsDisplayLine => {
          goodsDisplayLine.getGoodsCubes(grows).forEach(goodsCube => {
            const mapSpace = goodsDisplayLine.cityTile.mapSpace
            if (mapSpace !== null) {
              b.placeGoodsCubeToMapSpace(goodsCube, mapSpace)
            }
          })
        })
      }
    })

    return b
  }
}
