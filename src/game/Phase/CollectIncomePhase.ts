import { PhaseId } from 'enums'
import { Player, GameBuilder, PayExpensesPhase, context, type Game } from 'game'
import { type HasDelayExecute, type Phase } from './Phase'

export class CollectIncomePhase implements Phase, HasDelayExecute {
  public readonly id = PhaseId.COLLECT_INCOME

  public constructor (public readonly message: string) {}

  public deepCopy (): CollectIncomePhase {
    return new CollectIncomePhase(this.message)
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerMessages: string[] = []

    b.game.players.forEach(_ => {
      const player = new Player(
        _.id,
        _.userId,
        _.selectedAction,
        _.order,
        _.issuedShares,
        _.money + _.income,
        _.income,
        _.engine
      )
      const message = `${_.user.name}さんは収入${_.income}$を得ます。（所持金: ${_.money + _.income}$）`

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
