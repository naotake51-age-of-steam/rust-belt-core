import { type PhaseId } from 'enums'
import { type Game } from 'game/Game'

export interface Phase {
  id: PhaseId
  message: string
  cloneDeep: () => Phase
}

export interface HasDelayExecute {
  executeDelay: () => Game
}
