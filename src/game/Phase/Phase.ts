import { type PhaseId } from 'enums'
import { type Game } from 'game/Game'

export interface Phase {
  id: PhaseId
  message: string
  deepCopy: () => Phase
}

export interface HasDelayExecute {
  executeDelay: () => Game
}
