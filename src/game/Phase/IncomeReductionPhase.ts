import { PhaseId } from 'enums'
import { type Game, context } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { Phase } from './Phase'
import { ProductionPhase } from './ProductionPhase'

export class IncomeReductionPhase extends Phase {
  public readonly id = PhaseId.INCOME_REDUCTION

  public constructor (public readonly message: string) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerMessages: string[] = []

    b.game.players.forEach(_ => {
      const reduceIncome = this.getReduceIncome(_.income)
      const income = _.income - reduceIncome

      const player = _.produce((draft) => {
        draft.income = income
      })

      const playerMessage = `${_.name}さんは収入が${reduceIncome}$減ります。（収入: ${income}$）`

      newPlayers.push(player)
      playerMessages.push(playerMessage)
    })

    b.setPlayers(newPlayers)
    b.setPhase(new IncomeReductionPhase(playerMessages.join('\n')))

    return b
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

    ProductionPhase.prepare(b)

    return b.build()
  }
}
