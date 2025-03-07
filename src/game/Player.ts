import { Action } from 'enums'
import { type User, context } from 'game'
import { State } from './State'

const MAX_ISSUABLE_SHARES = 15
export const MAX_ENGINE = 6

export class Player extends State {
  constructor (
    public readonly id: number,
    public readonly uid: string,
    public readonly selectedAction: Action | null,
    public readonly order: number,
    public readonly issuedShares: number,
    public readonly money: number,
    public readonly income: number,
    public readonly engine: number
  ) {
    super()
  }

  public get user (): User {
    const { g } = context()

    const user = g.users.find(u => u.id === this.uid)

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

  public get placableTrackTileCount (): number {
    return this.selectedAction === Action.ENGINEER ? 4 : 3
  }

  public get placableCityTile (): number {
    return this.selectedAction === Action.URBANIZATION ? 1 : 0
  }
}
