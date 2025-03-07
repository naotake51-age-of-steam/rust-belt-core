import { PhaseId } from 'enums'
import { type Player, GameBuilder, PayExpensesPhase, context, type Game } from 'game'
import { State } from 'game/State'
import { type HasDelayExecute, type Phase } from './Phase'

export class CollectIncomePhase extends State implements Phase, HasDelayExecute {
  public readonly id = PhaseId.COLLECT_INCOME

  public constructor (public readonly message: string) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerMessages: string[] = []

    b.game.players.forEach(_ => {
      const player = _.produce((draft) => {
        draft.money += _.income
      })
      const message = `${_.name}さんは収入${_.income}$を得ます。（所持金: ${_.money + _.income}$）`

      newPlayers.push(player)
      playerMessages.push(message)
    })

    b.setPlayers(newPlayers)
    b.setPhase(new CollectIncomePhase(playerMessages.join('\n')))

    return b
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    PayExpensesPhase.prepare(b)

    return b.build()
  }
}
