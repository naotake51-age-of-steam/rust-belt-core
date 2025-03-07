import { Action } from 'enums'
import { context } from 'game'
import { State } from './State'

const MAX_ISSUABLE_SHARES = 15
export const MAX_ENGINE = 6

export class Player extends State {
  constructor (
    public readonly id: number,
    public readonly uid: string,
    public readonly name: string,
    public readonly color: string,
    public readonly action: Action | null,
    public readonly order: number,
    public readonly issuedShares: number,
    public readonly money: number,
    public readonly income: number,
    public readonly engine: number
  ) {
    super()
  }

  public get hasTurn (): boolean {
    const { g, p } = context()

    return g.turnPlayer.id === p?.id
  }

  public get remainingIssuableShares (): number {
    return MAX_ISSUABLE_SHARES - this.issuedShares
  }

  public get placableTrackTileCount (): number {
    return this.action === Action.ENGINEER ? 4 : 3
  }

  public get placableCityTile (): number {
    return this.action === Action.URBANIZATION ? 1 : 0
  }
}
