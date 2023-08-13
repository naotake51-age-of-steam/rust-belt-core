import { type Action } from 'enums'
import { type User, context } from 'game'

const MAX_ISSUABLE_SHARES = 15

export class Player {
  constructor (
    public readonly id: number,
    public readonly userId: string,
    public readonly selectedAction: Action | null,
    public readonly order: number,
    public readonly issuedShares: number,
    public readonly money: number
  ) {}

  public deepCopy (): Player {
    return new Player(
      this.id,
      this.userId,
      this.selectedAction,
      this.order,
      this.issuedShares,
      this.money
    )
  }

  public get user (): User {
    const { g } = context()

    const user = g.users.find(u => u.id === this.userId)

    if (user === undefined) throw new Error('user is not found')

    return user
  }

  public get hasTurn (): boolean {
    const { g, p } = context()

    return g.turnPlayer.id === p?.id
  }

  public get remainingIssuableShares (): number {
    return MAX_ISSUABLE_SHARES - this.issuedShares
  }
}
