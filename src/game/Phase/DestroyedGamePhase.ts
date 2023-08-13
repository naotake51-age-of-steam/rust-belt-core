import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class DestroyedGamePhase implements Phase {
  public readonly id = PhaseId.DESTROYED_GAME

  public deepCopy (): DestroyedGamePhase {
    return new DestroyedGamePhase()
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
