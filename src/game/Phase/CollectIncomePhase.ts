import { PhaseId } from 'enums'
import { type GameBuilder } from 'game'
import { type Phase } from './Phase'

export class CollectIncomePhase implements Phase {
  public readonly id = PhaseId.COLLECT_INCOME

  public deepCopy (): CollectIncomePhase {
    return new CollectIncomePhase()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
