import { type Action } from 'enums'
import { type User } from 'game'

const MAX_ISSUE_SHARES = 15

export class Player {
  constructor (
    public readonly id: number,
    public readonly userId: string,
    public readonly selectedAction: Action | null,
    public readonly order: number,
    public readonly issuedShares: number,
    public readonly money: number
  ) {}

  public get user (): User {
    throw new Error('Not implemented')
  }

  public get hasTurn (): boolean {
    throw new Error('Not implemented')
  }

  public get remainingIssueShares (): number {
    return MAX_ISSUE_SHARES - this.issuedShares
  }
}
