import { Action, PhaseId } from 'enums'
import { GameError } from 'errors'
import { Player, type Game, GameBuilder, context } from 'game'
import { type Phase } from './Phase'
import { SelectActionsPhase } from './SelectActionsPhase'

export class PlayerBid {
  constructor (
    public readonly playerId: number,
    public readonly money: number,
    public readonly canSoftPass: boolean,
    public readonly order: number | null
  ) {}

  public deepCopy (): PlayerBid {
    return new PlayerBid(
      this.playerId,
      this.money,
      this.canSoftPass,
      this.order
    )
  }

  public get player (): Player {
    const { g } = context()

    const player = g.players.find(_ => _.id === this.playerId)
    if (player === undefined) throw new Error('player is not found')

    return player
  }

  /**
   * 支払い金額
   */
  public calculatePaymentAmount (playersLength: number): number {
    // 最後の２人のうちどちらかが降りたら順番が決定する。その2人はorderがnullのまま
    // 3人プレイの場合は２位も全額支払う
    switch (this.order) {
      case playersLength: return 0
      case playersLength - 1: return Math.ceil(this.money / 2)
      default: return this.money
    }
  }

  /**
   * 決定した順番
   */
  public getResultOrder (lastDropoutPlayer: Player): number {
    // 最後の２人のうちどちらかが降りたら順番が決定する。その2人はorderがnullのまま
    if (this.order === null) {
      return this.playerId === lastDropoutPlayer.id ? 2 : 1
    }
    return this.order
  }
}

export class DeterminePlayerOrderPhase implements Phase {
  public readonly id = PhaseId.DETERMINE_PLAYER_ORDER
  constructor (
    public readonly playerBids: PlayerBid[], // order順
    public readonly latestActionMessage: string
  ) { }

  public deepCopy (): DeterminePlayerOrderPhase {
    return new DeterminePlayerOrderPhase(
      this.playerBids.map(_ => _.deepCopy()),
      this.latestActionMessage
    )
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const { g } = context()

    const playerBids = [...g.players]
      .sort((a, b) => a.order - b.order)
      .map(_ => new PlayerBid(_.id, 0, _.selectedAction === Action.TURN_ORDER_PASS, null))

    return b
      .setTurnPlayer(playerBids[0].player)
      .setPhase(new DeterminePlayerOrderPhase(playerBids, ''))
  }

  public get message (): string {
    const { g } = context()

    return `${this.latestActionMessage} ${g.turnPlayer.user.name}はアクションを決定してください。`
  }

  public minBids (): number {
    const bids = this.playerBids.map(_ => _.money)
    return Math.max(...bids) + 1
  }

  public maxBids (): number {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return p.money
  }

  public canBids (): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return p.money >= this.minBids()
  }

  public actionBids (money: number): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canBids()) throw new GameError('Cannot bid')

    if (money < this.minBids() || (this.maxBids() < money)) throw new GameError('Invalid bid')

    b.setPhase(new DeterminePlayerOrderPhase(
      this.playerBids.map(_ => _.playerId === p.id ? new PlayerBid(_.playerId, money, _.canSoftPass, _.order) : _),
      `${p.user.name}は${money}をビットしました。`
    ))

    const nextPlayer = this.getNextPlayer()
    if (nextPlayer === null) throw Error('logic error')

    b.setTurnPlayer(nextPlayer)

    return b.build()
  }

  public canSoftPass (): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const playerBid = this.playerBids.find(_ => _.playerId === p.id)
    if (playerBid === undefined) throw new Error('logic error')

    return playerBid.canSoftPass
  }

  public actionSoftPass (): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canSoftPass()) throw new GameError('Cannot soft pass')

    b.setPhase(new DeterminePlayerOrderPhase(
      this.playerBids.map(_ => _.playerId === p.id ? new PlayerBid(_.playerId, _.money, false, _.order) : _),
      `${p.user.name}はソフトパスしました。`
    ))

    const nextPlayer = this.getNextPlayer()
    if (nextPlayer === null) throw Error('logic error')

    b.setTurnPlayer(nextPlayer)

    return b.build()
  }

  public actionDropout (): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const unorderedPlayerBids = this.playerBids.filter(_ => _.order === null).length

    if (unorderedPlayerBids === 2) {
      this.playerBids.forEach(_ => {
        b.updatePlayer(
          new Player(
            _.player.id,
            _.player.userId,
            _.player.selectedAction,
            _.getResultOrder(p),
            _.player.issuedShares,
            _.player.money - _.calculatePaymentAmount(this.playerBids.length),
            _.player.income,
            _.player.engine
          )
        )
      })

      SelectActionsPhase.prepare(b)
    } else {
      b.setPhase(new DeterminePlayerOrderPhase(
        this.playerBids.map(_ => _.playerId === p.id ? new PlayerBid(_.playerId, _.money, _.canSoftPass, unorderedPlayerBids) : _),
        `${p.user.name}は降りました。`
      ))

      const nextPlayer = this.getNextPlayer()
      if (nextPlayer === null) throw Error('logic error')

      b.setTurnPlayer(nextPlayer)
    }

    return b.build()
  }

  private getNextPlayer (): Player | null {
    const { p } = context()

    if (p === null) throw new Error('logic error')

    const unorderedPlayerBids = this.playerBids.filter(_ => _.order === null)
    if (unorderedPlayerBids.length < 2) throw new Error('logic error')

    const turnPlayerIndex = unorderedPlayerBids.findIndex(_ => _.playerId === p.id)
    if (turnPlayerIndex === -1) throw new Error('logic error')

    const nextPlayerIndex = (turnPlayerIndex + 1) % unorderedPlayerBids.length

    return unorderedPlayerBids[nextPlayerIndex].player
  }
}
