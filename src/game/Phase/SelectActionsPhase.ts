import { type Action, PhaseId } from 'enums'
import { type GameBuilder, type Game, context, Player } from 'game'
import { type Phase } from './Phase'

export class SelectActionsPhase implements Phase {
  public readonly id = PhaseId.SELECT_ACTIONS

  public get selectableActions (): Action[] {
    throw new Error('Not implemented')
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
    throw new Error('Not implemented')
  }

  public actionSelectAction (action: Action): Game {
    throw new Error('Not implemented')
  }
}
