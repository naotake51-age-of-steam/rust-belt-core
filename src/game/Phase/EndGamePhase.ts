import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class EndGamePhase implements Phase {
  public readonly id = PhaseId.END_GAME

  public get message (): string {
    throw new Error('Not implemented')
  }
}
