import { PhaseId } from 'enums'
import { type Game, context, IncomeReductionPhase } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { State } from 'game/State'
import { type HasDelayExecute, type Phase } from './Phase'

export class PayExpensesPhase extends State implements Phase, HasDelayExecute {
  public readonly id = PhaseId.PAY_EXPENSES

  public constructor (public readonly message: string) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerMessages: string[] = []

    b.game.players.forEach(_ => {
      const payment = _.issuedShares + _.engine
      const money = _.money < payment ? 0 : _.money - payment
      const reduceIncome = _.money < payment ? payment - _.money : 0
      const income = _.income < reduceIncome ? 0 : _.income - reduceIncome
      const shortage = reduceIncome - _.income

      newPlayers.push(_.produce((draft) => {
        draft.money = money
        draft.income = income
      }))

      let playerMessage = `${_.user.name}さんは${payment}$を支払います。（所持金: ${money}$）`

      if (reduceIncome > 0) {
        playerMessage += ` 収入を${reduceIncome}$減らします。（収入: ${income}$）`
      }

      if (shortage > 0) {
        playerMessage += ` 支払いコストが${shortage}$足りません。ゲームから離脱します。`

        // TODO:: 離脱処理
      }

      playerMessages.push(playerMessage)
    })

    b.setPlayers(newPlayers)
    b.setPhase(new PayExpensesPhase(playerMessages.join('\n')))

    return b
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    IncomeReductionPhase.prepare(b)

    return b.build()
  }
}
