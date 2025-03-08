import { PhaseId } from 'enums'
import { Phase } from './Phase'

export class DestroyedGamePhase extends Phase {
  public readonly id = PhaseId.DESTROYED_GAME

  public get message (): string {
    throw new Error('Not implemented')
  }
}
