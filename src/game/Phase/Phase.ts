import { type PhaseId } from 'enums'
import { type Game } from 'game/Game'
import { State } from 'game/State'

export abstract class Phase extends State {
  abstract id: PhaseId
  abstract message: string
}

export interface HasDelayExecute {
  executeDelay: () => Game
}
