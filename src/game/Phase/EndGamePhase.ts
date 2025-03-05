import { PhaseId } from 'enums'
import { type Game, context } from 'game'
import { type GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { initializeGame } from 'initializeGame'
import { trackTiles } from 'objects'
import { type Phase } from './Phase'

export class EndGamePhase implements Phase {
  public readonly id = PhaseId.END_GAME

  public constructor (public readonly playerScores: number[]) {}

  public deepCopy (): EndGamePhase {
    return new EndGamePhase(this.playerScores)
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.setPhase(new EndGamePhase(
      b.game.players.map(_ => this.calculatePlayerScore(_))
    ))

    return b
  }

  private static calculatePlayerScore (player: Player): number {
    let lineCount = 0
    trackTiles.forEach(trackTile => {
      trackTile.lines.forEach(line => {
        if (line.isFixed && line.owner?.id === player.id) {
          lineCount++
        }
      })
    })

    return player.income * 3 + lineCount
  }

  public get winners (): Player[] {
    const topScore = Math.max(...this.playerScores)

    const { g } = context()
    return g.players.filter((_, idx) => this.playerScores[idx] === topScore)
  }

  public get message (): string {
    const { g } = context()
    return [
      this.winners.map(_ => _.user.name).join('さん、') + 'さんが勝利しました！',
      ...g.players.map((_, idx) => `${_.user.name}さん: ${this.playerScores[idx]}点`)
    ].join('\n')
  }

  public actionFinishGame (): Game {
    const { g } = context()

    return initializeGame(g.id, g.adminUser)
  }
}
