import { PhaseId } from 'enums'
import { GameBuilder } from 'game/GameBuilder'
import { type Phase } from './Phase'

export class PayExpensesPhase implements Phase {
  public readonly id = PhaseId.PAY_EXPENSES

  public deepCopy (): PayExpensesPhase {
    return new PayExpensesPhase()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    return b
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
