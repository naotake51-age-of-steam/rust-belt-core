import { type PhaseId } from 'enums'
import { State } from 'game/State'

export abstract class Phase extends State {
  abstract id: PhaseId
  abstract message: string
}
