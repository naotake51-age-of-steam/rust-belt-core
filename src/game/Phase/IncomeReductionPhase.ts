import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { type Game, context, EndGamePhase } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { Phase } from './Phase'
import { ProductionPhase } from './ProductionPhase'

class IncomeReduction {
  constructor (
    public readonly playerId: number,
    public readonly reduceIncome: number
  ) {
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class IncomeReductionPhase extends Phase {
  public readonly id = PhaseId.INCOME_REDUCTION

  @Type(() => IncomeReduction)
  public readonly playerIncomeReductions: IncomeReduction[]

  public constructor (playerIncomeReductions: IncomeReduction[]) {
    super()

    this.playerIncomeReductions = playerIncomeReductions
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerIncomeReductions: IncomeReduction[] = []

    b.game.players.forEach(_ => {
      if (!_.alive) {
        newPlayers.push(_)
        return
      }

      const reduceIncome = this.getReduceIncome(_.income)
      const income = _.income - reduceIncome

      const player = _.produce((draft) => {
        draft.income = income
      })

      newPlayers.push(player)

      playerIncomeReductions.push(new IncomeReduction(player.id, reduceIncome))
    })

    b.setPlayers(newPlayers)

    b.setTurnPlayer(null)

    b.setPhase(new IncomeReductionPhase(playerIncomeReductions))

    return b
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return 'プレイヤーの収益が低下します。'
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
      return 10
    } else {
      throw new Error('logic error')
    }
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    if (b.game.round >= g.lastRound) {
      EndGamePhase.prepare(b)
    } else {
      ProductionPhase.prepare(b)
    }

    return b.build()
  }
}
