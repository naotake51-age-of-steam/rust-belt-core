import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class IncomeReductionPhase implements Phase {
  public readonly id = PhaseId.INCOME_REDUCTION

  public static prepare (): IncomeReductionPhase {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
