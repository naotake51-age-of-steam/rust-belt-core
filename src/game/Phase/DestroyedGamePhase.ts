import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class DestroyedGamePhase implements Phase {
  public readonly id = PhaseId.DESTROYED_GAME

  public get message (): string {
    throw new Error('Not implemented')
  }
}
