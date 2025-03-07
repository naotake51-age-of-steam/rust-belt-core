import { PhaseId } from 'enums'
import { State } from 'game/State'
import { type Phase } from './Phase'

export class DestroyedGamePhase extends State implements Phase {
  public readonly id = PhaseId.DESTROYED_GAME

  public get message (): string {
    throw new Error('Not implemented')
  }
}
