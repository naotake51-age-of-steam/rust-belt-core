import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { GameBuilder, context, type Game, EndGamePhase, ProductionPhase } from 'game'
import { type Player } from 'game/Player'
import { State } from 'game/State'
import { Phase } from './Phase'
import { UnderpaymentPhase } from './UnderpaymentPhase'

export class PlayerSettlement extends State {
  constructor (
    public readonly playerId: number,
    public readonly confirm: boolean,
    public readonly money: number,
    public readonly income: number,
    public readonly afterMoneyByIncome: number,
    public readonly payment: number,
    public readonly afterMoneyByPayment: number,
    public readonly reduceIncome: number,
    public readonly afterIncome: number
  ) {
    super()
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class SettlementPhase extends Phase {
  public readonly id = PhaseId.SETTLEMENT

  @Type(() => PlayerSettlement)
  public readonly playerSettlements: PlayerSettlement[]

  public constructor (playerSettlements: PlayerSettlement[]) {
    super()

    this.playerSettlements = playerSettlements
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const playerSettlements = b.game.alivePlayers
      .map(_ => {
        const money = _.money
        const income = _.income
        const afterMoneyByIncome = money + income
        const payment = _.issuedShares + _.engine
        const afterMoneyByPayment = afterMoneyByIncome - payment
        const reduceIncome = this.getReduceIncome(income)
        const afterIncome = income - reduceIncome

        return new PlayerSettlement(
          _.id,
          false,
          money,
          income,
          afterMoneyByIncome,
          payment,
          afterMoneyByPayment,
          reduceIncome,
          afterIncome
        )
      })

    playerSettlements.forEach((playerSettlement) => {
      b.updatePlayer(
        playerSettlement.player.produce((draft) => {
          draft.money = playerSettlement.afterMoneyByPayment
          draft.income = playerSettlement.afterIncome
        })
      )
    })

    b
      .setTurnPlayer(null)
      .setPhase(new SettlementPhase(playerSettlements))

    return b
  }

  public canConfirm (): boolean {
    const { p } = context()

    if (p === null) {
      return false
    }

    return this.playerSettlements.some(_ => _.playerId === p.id && !_.confirm)
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

    const newPlayerSettlements = this.playerSettlements.map((playerSettlement) => {
      if (playerSettlement.playerId === p.id) {
        return playerSettlement.produce((draft) => {
          draft.confirm = true
        })
      }

      return playerSettlement
    })

    if (newPlayerSettlements.every(_ => _.confirm)) {
      const playerUnderpayments = newPlayerSettlements.filter(_ => _.afterMoneyByPayment < 0)

      if (playerUnderpayments.length > 0) {
        return UnderpaymentPhase.prepare(b, playerUnderpayments).build()
      }

      if (b.game.round >= g.lastRound) {
        return EndGamePhase.prepare(b).build()
      } else {
        return ProductionPhase.prepare(b).build()
      }
    }

    return b.setPhase(
      new SettlementPhase(newPlayerSettlements)
    ).build()
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return '各プレイヤーの決算を行いました。'
  }

  private static getReduceIncome (income: number): number {
    if (income <= 10) {
      return 0
    } else if (income >= 11 && income <= 20) {
      return 2
    } else if (income >= 21 && income <= 30) {
      return 4
    } else if (income >= 31 && income <= 40) {
      return 6
    } else if (income >= 41 && income <= 49) {
      return 8
    } else if (income >= 50) {
      return 10 // NOTE:: 最後不規則だが正しい
    } else {
      throw new Error('logic error')
    }
  }
}
