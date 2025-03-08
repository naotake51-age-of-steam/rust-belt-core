import { type Action, PhaseId, allActions } from 'enums'
import { type Game, context, type Player, GameBuilder } from 'game'
import { BuildTrackPhase } from './BuildTrackPhase'
import { Phase } from './Phase'

export class SelectActionsPhase extends Phase {
  public readonly id = PhaseId.SELECT_ACTIONS

  public get selectableActions (): Action[] {
    const { g } = context()

    const actions = g.players.map(_ => _.action)

    return allActions.filter(_ => !actions.includes(_))
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.setPlayers(b.game.players // DeterminePlayerOrderPhaseでorderを更新しているので、b.gameからデータを取得する必要がある
      .map(_ => _.produce((draft) => {
        draft.action = null
      })))

    b.setPhase(new SelectActionsPhase())

    const firstPlayer = b.game.players.find(_ => _.order === 1)
    if (firstPlayer === undefined) throw new Error('logic error')

    b.setTurnPlayer(firstPlayer)

    return b
  }

  public get message (): string {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return `${p.name}はアクションを選択してください`
  }

  public canSelectAction (action: Action): boolean {
    return this.selectableActions.includes(action)
  }

  public actionSelectAction (action: Action): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canSelectAction(action)) throw new Error('invalid action')

    const nextPlayer = this.getNextPlayer()

    const b = new GameBuilder(g)

    b.updatePlayer(
      p.produce(draft => {
        draft.action = action
      })
    )

    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
    } else {
      BuildTrackPhase.prepare(b)
    }

    return b.build()
  }

  private getNextPlayer (): Player | null {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return g.players.find(_ => _.order === p.order + 1) ?? null
  }
}
