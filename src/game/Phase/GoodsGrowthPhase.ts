import { PhaseId } from 'enums'
import { type Phase } from './Phase'

// TODO:: もう少しいい設計がありそう
export class GoodsGrowthPhase implements Phase {
  public readonly id = PhaseId.GOODS_GROWTH

  constructor (
    public readonly whiteDices: number[], // プレイヤーの数だけ
    public readonly blackDices: number[] // プレイヤーの数だけ
  ) {}

  public get message (): string {
    throw new Error('Not implemented')
  }

  public static prepare (): GoodsGrowthPhase {
    // 一定時間後に次のフェーズに移行する
    throw new Error('Not implemented')
  }
}
