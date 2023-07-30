import { PhaseId } from 'enums'
import { type Game, type User } from 'game'
import { type Phase } from './Phase'

export class WaitingStartPhase implements Phase {
  public readonly id = PhaseId.WAITING_START

  constructor (
    public readonly joinedUsers: User[]
  ) { }

  public static prepare (): WaitingStartPhase {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public canJoinUser (): boolean {
    throw new Error('Not implemented')
  }

  public actionJoinUser (): Game {
    throw new Error('Not implemented')
  }

  public canRemoveUser (): boolean {
    throw new Error('Not implemented')
  }

  public actionRemoveUser (): Game {
    throw new Error('Not implemented')
  }

  public canStartGame (): boolean {
    throw new Error('Not implemented')
  }

  public actionStartGame (): Game {
    throw new Error('Not implemented')
  }
}
