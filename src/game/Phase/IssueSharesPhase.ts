import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { type Game, context, Player, GameBuilder } from 'game'
import { DeterminePlayerOrderPhase } from './DeterminePlayerOrderPhase'
import { type Phase } from './Phase'

export class IssueSharesPhase implements Phase {
  public readonly id = PhaseId.ISSUE_SHARES

  public get message (): string {
    const { g } = context()

    const userName = g.turnPlayer.user.name
    return `${userName}は株式を発行数を決定してください。`
  }

  public static prepare (): IssueSharesPhase {
    return new IssueSharesPhase()
  }

  public maxIssueShares (): number {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return p.remainingIssuableShares
  }

  public canIssueShares (): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return this.maxIssueShares() > 0
  }

  public actionIssueShares (count: number): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canIssueShares()) throw new GameError('Cannot issue shares')

    const nextPlayer = this.getNextPlayer(p)

    b.updatePlayer(new Player(
      p.id,
      p.userId,
      p.selectedAction,
      p.order,
      p.issuedShares + count,
      p.money + count * 5
    ))

    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
    } else {
      DeterminePlayerOrderPhase.prepare(b)
    }

    return b.build()
  }

  private getNextPlayer (player: Player): Player | null {
    const { g } = context()

    const players = g.players.filter(_ => _.remainingIssuableShares > 0)

    const nextIndex = players.findIndex(_ => _.id === player.id) + 1
    if (players.length <= nextIndex) return null

    return players[nextIndex]
  }

  public actionPassShares (): Game {
    const { p, g } = context()
    const b = new GameBuilder(g)

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const nextPlayer = this.getNextPlayer(p)

    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
    } else {
      DeterminePlayerOrderPhase.prepare(b)
    }

    return b.build()
  }
}
