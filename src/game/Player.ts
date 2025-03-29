import { Action } from 'enums'
import { type PlayerColor } from 'enums/PlayerColor'
import { context } from 'game'
import { MAX_ISSUES } from '../objects/index'
import { State } from './State'

export class Player extends State {
  constructor (
    public readonly id: number,
    public readonly uid: string,
    public readonly name: string,
    public readonly color: PlayerColor,
    public readonly action: Action | null,
    public readonly order: number,
    public readonly issuedShares: number,
    public readonly money: number,
    public readonly income: number,
    public readonly engine: number,
    public readonly alive: boolean = true
  ) {
    super()
  }

  public get hasTurn (): boolean {
    const { g } = context()

    return g.turnPlayer?.id === this.id
  }

  public get remainingIssuableShares (): number {
    return MAX_ISSUES - this.issuedShares
  }

  public get placableTrackTileCount (): number {
    return this.action === Action.ENGINEER ? 4 : 3
  }

  public get placableCityTile (): number {
    return this.action === Action.URBANIZATION ? 1 : 0
  }

  public is (player: Player): boolean {
    return this.id === player.id
  }
}
