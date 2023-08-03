import { type Action, PhaseId, allActions } from 'enums'
import { type Game, context, Player, GameBuilder } from 'game'
import { BuildTrackPhase } from './BuildTrackPhase'
import { type Phase } from './Phase'

export class SelectActionsPhase implements Phase {
  public readonly id = PhaseId.SELECT_ACTIONS

  public get selectableActions (): Action[] {
    const { g } = context()

    const selectedActions = g.players.map(_ => _.selectedAction)

    return allActions.filter(_ => !selectedActions.includes(_))
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const { g } = context()
    b.setPlayers(g.players.map(_ => new Player(_.id, _.userId, null, _.order, _.issuedShares, _.money)))
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

    return `${p.user.name}はアクションを選択してください`
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

    b.updatePlayer(new Player(p.id, p.userId, action, p.order, p.issuedShares, p.money))

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
