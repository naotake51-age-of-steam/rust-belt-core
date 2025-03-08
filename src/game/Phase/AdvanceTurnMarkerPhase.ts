import { PhaseId } from 'enums'
import { EndGamePhase, type Game, IssueSharesPhase, context } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { Phase } from './Phase'

export class AdvanceTurnMarkerPhase extends Phase {
  public readonly id = PhaseId.BUILD_TRACK
  public readonly message = 'ターンマーカーを進めます。'

  public static prepare (b: GameBuilder): GameBuilder {
    b.setPhase(new AdvanceTurnMarkerPhase())

    return b
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    if (b.game.round >= this.getLastRound()) {
      EndGamePhase.prepare(b)
    } else {
      b.setRound(b.game.round + 1)
      IssueSharesPhase.prepare(b)
    }

    return b.build()
  }

  private getLastRound (): number {
    const { g } = context()
    const players = g.players.length

    if (players === 3) {
      return 9
    } else if (players === 4) {
      return 7
    } else if (players === 5) {
      return 6
    } else if (players === 6) {
      return 5
    } else {
      throw new Error('logic error')
    }
  }
}
