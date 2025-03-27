import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { GameBuilder, context, type Game, EndGamePhase, ProductionPhase, type PlayerSettlement } from 'game'
import { type Player } from 'game/Player'
import { State } from 'game/State'
import { Phase } from './Phase'

export class PlayerUnderpayment extends State {
  constructor (
    public readonly playerId: number,
    public readonly confirm: boolean,
    public readonly income: number,
    public readonly reduceIncome: number,
    public readonly afterIncome: number,
    public readonly afterAlive: boolean
  ) {
    super()
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class UnderpaymentPhase extends Phase {
  public readonly id = PhaseId.UNDERPAYMENT

  @Type(() => PlayerUnderpayment)
  public readonly playerUnderpayments: PlayerUnderpayment[]

  public constructor (playerUnderpayments: PlayerUnderpayment[]) {
    super()

    this.playerUnderpayments = playerUnderpayments
  }

  public static prepare (b: GameBuilder, playerSettlements: PlayerSettlement[]): GameBuilder {
    const playerUnderpayments = playerSettlements
      .map(playerSettlement => {
        const income = playerSettlement.afterIncome
        const reduceIncome = -playerSettlement.afterMoneyByPayment
        const afterIncome = income - reduceIncome
        const afterAlive = afterIncome >= 0

        return new PlayerUnderpayment(
          playerSettlement.playerId,
          false,
          income,
          reduceIncome,
          afterIncome,
          afterAlive
        )
      })

    playerUnderpayments.forEach((playerUnderpayment) => {
      b.updatePlayer(
        playerUnderpayment.player.produce((draft) => {
          draft.money = 0
          draft.income = playerUnderpayment.afterIncome
          draft.alive = playerUnderpayment.afterAlive
        })
      )
    })

    b
      .setTurnPlayer(null)
      .setPhase(new UnderpaymentPhase(playerUnderpayments))

    return b
  }

  public canConfirm (): boolean {
    const { p } = context()

    if (p === null) {
      return false
    }

    return this.playerUnderpayments.some(_ => _.playerId === p.id && !_.confirm)
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

    const newPlayerUnderpayments = this.playerUnderpayments.map((playerSettlement) => {
      if (playerSettlement.playerId === p.id) {
        return playerSettlement.produce((draft) => {
          draft.confirm = true
        })
      }

      return playerSettlement
    })

    if (newPlayerUnderpayments.every(_ => _.confirm)) {
      if (b.game.round >= g.lastRound || b.game.players.filter(_ => _.alive).length <= 1) {
        return EndGamePhase.prepare(b).build()
      } else {
        return ProductionPhase.prepare(b).build()
      }
    }

    return b.setPhase(
      new UnderpaymentPhase(newPlayerUnderpayments)
    ).build()
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return '各プレイヤーの支払い不足分を減収します。'
  }
}
