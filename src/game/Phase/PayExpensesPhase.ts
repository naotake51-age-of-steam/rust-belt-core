import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class PayExpensesPhase implements Phase {
  public readonly id = PhaseId.PAY_EXPENSES

  public deepCopy (): PayExpensesPhase {
    return new PayExpensesPhase()
  }

  public static prepare (): PayExpensesPhase {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
