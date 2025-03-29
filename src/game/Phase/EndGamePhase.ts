import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { context } from 'game'
import { type GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { trackTiles } from 'objects'
import { Phase } from './Phase'

class PlayerScore {
  constructor (
    public readonly playerId: number,
    public readonly income: number,
    public readonly issueShares: number,
    public readonly lineCount: number,
    public readonly total: number
  ) {
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class EndGamePhase extends Phase {
  public readonly id = PhaseId.END_GAME

  @Type(() => PlayerScore)
  public readonly playerScores: PlayerScore[]

  public constructor (playerScores: PlayerScore[]) {
    super()

    this.playerScores = playerScores
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.persist()

    b
      .setTurnPlayer(null)
      .setPhase(new EndGamePhase(
        b.game.alivePlayers.map(_ => this.calculatePlayerScore(_))
      ))

    return b
  }

  private static calculatePlayerScore (player: Player): PlayerScore {
    let lineCount = 0
    trackTiles.forEach(trackTile => {
      trackTile.lines.forEach(line => {
        if (line.isFixed && line.owner !== null && line.owner.is(player)) {
          lineCount += trackTile.town === null ? 0.5 : 1
        }
      })
    })

    return new PlayerScore(
      player.id,
      player.income,
      player.issuedShares,
      lineCount,
      (player.income - player.issuedShares) * 3 + lineCount
    )
  }

  private get winners (): Player[] {
    const maxScore = Math.max(...this.playerScores.map(_ => _.total))

    return this.playerScores.filter(_ => _.total === maxScore).map(_ => _.player)
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    const winners = this.winners

    return 'お疲れ様です。ゲームが終了しました。\n' + (
      winners.length !== 0
        ? winners.map(_ => _.name).join('、') + 'の勝利です。🎉🎉🎉'
        : 'すべてのプレイヤーが破産したため勝利者はいません。😢'
    )
  }
}
