import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { GameBuilder, PayExpensesPhase, context, type Game } from 'game'
import { type Player } from 'game/Player'
import { Phase, type HasDelayExecute } from './Phase'

class Income {
  constructor (
    public readonly playerId: number,
    public readonly income: number
  ) {
  }

  public get player (): Player {
    const { g } = context()

    const player = g.players.find(_ => _.id === this.playerId)
    if (player === undefined) {
      throw new Error('player not found')
    }

    return player
  }
}

export class CollectIncomePhase extends Phase implements HasDelayExecute {
  public readonly id = PhaseId.COLLECT_INCOME

  @Type(() => Income)
  public readonly playerIncomes: Income[]

  public constructor (playerIncomes: Income[]) {
    super()

    this.playerIncomes = playerIncomes
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerIncomes: Income[] = []

    b.game.players.forEach(_ => {
      const income = _.income

      newPlayers.push(_.produce((draft) => {
        draft.money += income
      }))

      playerIncomes.push(new Income(_.id, income))
    })

    b.setPlayers(newPlayers)

    b.setPhase(new CollectIncomePhase(playerIncomes))

    return b
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return 'プレイヤーは収入を受け取ります。'
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    PayExpensesPhase.prepare(b)

    return b.build()
  }
}
