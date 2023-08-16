import { PhaseId } from 'enums'
import { type GameBuilder } from 'game/GameBuilder'
import { type Phase } from './Phase'

// TODO:: もう少しいい設計がありそう
export class GoodsGrowthPhase implements Phase {
  public readonly id = PhaseId.GOODS_GROWTH

  constructor (
    public readonly whiteDices: number[], // プレイヤーの数だけ
    public readonly blackDices: number[] // プレイヤーの数だけ
  ) {}

  public deepCopy (): GoodsGrowthPhase {
    return new GoodsGrowthPhase(
      [...this.whiteDices],
      [...this.blackDices]
    )
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public static prepare (b: GameBuilder): GameBuilder {
    return b.setPhase(new GoodsGrowthPhase([], []))
  }
}
