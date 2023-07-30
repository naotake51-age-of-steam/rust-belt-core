import { type Action, PhaseId } from 'enums'
import { type Game } from 'game'
import { type Phase } from './Phase'

export class SelectActionsPhase implements Phase {
  public readonly id = PhaseId.SELECT_ACTIONS

  public get selectableActions (): Action[] {
    throw new Error('Not implemented')
  }

  public static prepare (): SelectActionsPhase {
    // このタイミングでPlayerのactionをnullに初期化する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public actionSelectAction (action: Action): Game {
    throw new Error('Not implemented')
  }
}
