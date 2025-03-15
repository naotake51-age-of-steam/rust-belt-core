import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { context, type Player, GameBuilder, type Game } from 'game'
import { DeterminePlayerOrderPhase } from './DeterminePlayerOrderPhase'
import { Phase } from './Phase'

export class IssueSharesPhase extends Phase {
  public readonly id = PhaseId.ISSUE_SHARES

  public get message (): string {
    const { g } = context()

    if (g.turnPlayer === null) throw new Error('turn player is null')

    const userName = g.turnPlayer.name
    return `${userName}は株式を発行数を決定してください。`
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.setPhase(new IssueSharesPhase())

    const firstPlayer = IssueSharesPhase.getOrderedPlayers()[0]
    if (firstPlayer === undefined) throw new Error('logic error')
    b.setTurnPlayer(firstPlayer)

    return b
  }

  public isTurnPlayer (): boolean {
    const { p } = context()

    return p?.hasTurn ?? false
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

    b.updatePlayer(
      p.produce(draft => {
        draft.issuedShares += count
        draft.money += count * 5
      })
    )

    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
    } else {
      DeterminePlayerOrderPhase.prepare(b)
    }

    return b.build()
  }

  private getNextPlayer (player: Player): Player | null {
    const players = IssueSharesPhase.getOrderedPlayers().filter(_ => _.order > player.order)

    return players[0] ?? null
  }

  private static getOrderedPlayers (): Player[] {
    const { g } = context()

    return [...g.alivePlayers]
      .filter(_ => _.remainingIssuableShares > 0)
      .sort((a, b) => a.order - b.order)
  }
}
