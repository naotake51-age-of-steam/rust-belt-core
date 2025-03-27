import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { context } from 'game'
import { type Game } from 'game/Game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { State } from 'game/State'
import { type GoodsDisplay, goodsDisplayBlack, goodsDisplayWhite } from 'objects'
import { random, range } from 'utility'
import { AdvanceTurnMarkerPhase } from './AdvanceTurnMarkerPhase'
import { Phase } from './Phase'

export class PlayerConfirm extends State {
  constructor (
    public readonly playerId: number,
    public readonly confirm: boolean
  ) {
    super()
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class GoodsGrowthPhase extends Phase {
  public readonly id = PhaseId.GOODS_GROWTH

  @Type(() => PlayerConfirm)
  public readonly playerConfirms: PlayerConfirm[]

  public constructor (
    public readonly whiteDices: number[],
    public readonly blackDices: number[],
    playerConfirms: PlayerConfirm[]
  ) {
    super()

    this.playerConfirms = playerConfirms
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const whiteDices = b.game.players.map(_ => random(1, 6))// プレイヤー数だけダイスを振る
    b = this.growGoodsCubes(goodsDisplayWhite, whiteDices, b)

    const blackDices = b.game.players.map(_ => random(1, 6))// プレイヤー数だけダイスを振る
    b = this.growGoodsCubes(goodsDisplayBlack, blackDices, b)

    b.setTurnPlayer(null)

    b.setPhase(new GoodsGrowthPhase(
      whiteDices,
      blackDices,
      b.game.alivePlayers.map(_ => new PlayerConfirm(_.id, false)))
    )

    return b
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return 'ダイス目の商品を配置しました。'
  }

  public canConfirm (): boolean {
    const { p } = context()

    if (p === null) {
      return false
    }

    return this.playerConfirms.some(_ => _.playerId === p.id && !_.confirm)
  }

  public actionConfirm (): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (!this.canConfirm()) {
      throw new GameError('Cannot confirm')
    }

    if (p === null) {
      throw new GameError('Player is null')
    }

    const newPlayerUnderpayments = this.playerConfirms.map((playerConfirm) => {
      if (playerConfirm.playerId === p.id) {
        return playerConfirm.produce((draft) => {
          draft.confirm = true
        })
      }

      return playerConfirm
    })

    if (newPlayerUnderpayments.every(_ => _.confirm)) {
      AdvanceTurnMarkerPhase.prepare(b)

      return b.build()
    }

    return b.setPhase(
      this.produce((draft) => {
        draft.playerConfirms = newPlayerUnderpayments
      })
    ).build()
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
