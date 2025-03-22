import { PhaseId } from 'enums'
import { type Game, IssueSharesPhase, context } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { Phase } from './Phase'

export class AdvanceTurnMarkerPhase extends Phase {
  public readonly id = PhaseId.ADVANCE_TURN_MARKER
  public readonly message = '次のラウンドに進みます。'

  public static prepare (b: GameBuilder): GameBuilder {
    b.setPhase(new AdvanceTurnMarkerPhase())

    b.setRound(b.game.round + 1)

    b.setTurnPlayer(null)

    return b
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    IssueSharesPhase.prepare(b)

    return b.build()
  }
}
