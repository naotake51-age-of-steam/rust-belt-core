import { PhaseId, Action } from 'enums'
import { type GameBuilder, type Game, context, type Player } from 'game'
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

  public static prepare (b: GameBuilder): GameBuilder {
    const players = MoveGoodsPhase.getOrderedPlayers()
    b.setTurnPlayer(players[0])
    return b.setPhase(new MoveGoodsPhase(null, [], 1, []))
  }

  public static getOrderedPlayers (): Player[] {
    const { g } = context()
    return [...g.players].sort((a, b) => {
      if (a.selectedAction === Action.FIRST_MOVE) {
        return -1
      }
      if (b.selectedAction === Action.FIRST_MOVE) {
        return 1
      }
      return a.order - b.order
    })
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
