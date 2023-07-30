import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class AdvanceTurnMarkerPhase implements Phase {
  public readonly id = PhaseId.BUILD_TRACK

  public static prepare (): AdvanceTurnMarkerPhase {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }
}
