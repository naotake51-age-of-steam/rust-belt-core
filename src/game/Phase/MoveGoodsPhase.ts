import { PhaseId } from 'enums'
import { type Game } from 'game'
import { type Phase } from './Phase'

export class MoveGoodsPhase implements Phase {
  public readonly id = PhaseId.MOVE_GOODS

  constructor (
    public readonly selectedGoodsCubeId: number | null,
    public readonly movedSpaceIds: number[],
    public readonly movingCounter: number, // 1 or 2
    public readonly incrementedLocomotivePlayerIds: number[] // プレイヤーは二回の輸送のうち一回だけ機関車を進められる
  ) {}

  public deepCopy (): MoveGoodsPhase {
    return new MoveGoodsPhase(
      this.selectedGoodsCubeId,
      [...this.movedSpaceIds],
      this.movingCounter,
      [...this.incrementedLocomotivePlayerIds]
    )
  }

  public static prepare (): MoveGoodsPhase {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public actionSelectGoodsCube (goodsCubeId: number): Game {
    throw new Error('Not implemented')
  }

  public canMoveGoodsCube (mapSpaceId: number): boolean {
    throw new Error('Not implemented')
  }

  public actionMoveGoodsCube (mapSpaceId: number): Game {
    throw new Error('Not implemented')
  }

  public actionPassCube (mapSpaceId: number): Game {
    throw new Error('Not implemented')
  }

  public canIncrementLocomotive (): boolean {
    throw new Error('Not implemented')
  }

  public actionIncrementLocomotive (): Game {
    throw new Error('Not implemented')
  }
}
