import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { context, IssueSharesPhase } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { State } from 'game/State'
import { type Game } from '../Game'
import { Phase } from './Phase'

export class PlayerConfirmForAdvanceTurnMarker extends State {
  constructor (
    public readonly playerId: number,
    public readonly confirm: boolean
  ) {
    super()
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class AdvanceTurnMarkerPhase extends Phase {
  public readonly id = PhaseId.ADVANCE_TURN_MARKER
  public readonly message = '次のラウンドに進みます。'

  @Type(() => PlayerConfirmForAdvanceTurnMarker)
  public readonly playerConfirms: PlayerConfirmForAdvanceTurnMarker[]

  public constructor (
    playerConfirms: PlayerConfirmForAdvanceTurnMarker[]
  ) {
    super()

    this.playerConfirms = playerConfirms
  }

  public static prepare (b: GameBuilder): GameBuilder {
    b.persist()

    b.setPhase(new AdvanceTurnMarkerPhase(b.game.alivePlayers.map(_ => new PlayerConfirmForAdvanceTurnMarker(_.id, false))))

    b.setTurnPlayer(null)

    return b
  }

  public canConfirm (): boolean {
    const { p } = context()

    if (p === null) {
      return false
    }

    return this.playerConfirms.some(_ => _.playerId === p.id && !_.confirm)
  }

  public actionConfirm (): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (!this.canConfirm()) {
      throw new GameError('Cannot confirm')
    }

    if (p === null) {
      throw new GameError('Player is null')
    }

    const newPlayerUnderpayments = this.playerConfirms.map((playerConfirm) => {
      if (playerConfirm.playerId === p.id) {
        return playerConfirm.produce((draft) => {
          draft.confirm = true
        })
      }

      return playerConfirm
    })

    if (newPlayerUnderpayments.every(_ => _.confirm)) {
      b.setRound(b.game.round + 1)

      return IssueSharesPhase.prepare(b).build()
    }

    return b.setPhase(
      this.produce((draft) => {
        draft.playerConfirms = newPlayerUnderpayments
      })
    ).build()
  }
}
