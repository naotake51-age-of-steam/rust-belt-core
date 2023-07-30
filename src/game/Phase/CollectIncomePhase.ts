import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class CollectIncomePhase implements Phase {
  public readonly id = PhaseId.COLLECT_INCOME

  public static prepare (): CollectIncomePhase {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
