import { type GoodsCubeColor } from 'enums'
import { type GoodsCubeState, context } from 'game'
import { type MapSpace } from 'objects'
import { type GoodsDisplaySpace } from './GoodsDisplay'

export class GoodsCube {
  constructor (
    public readonly id: number,
    public readonly color: GoodsCubeColor
  ) {}

  public get state (): GoodsCubeState {
    const { g } = context()
    return g.goodsCubeStates[this.id]
  }

  public get mapSpace (): MapSpace | null {
    return this.state.mapSpace
  }

  public get goodsDisplaySpace (): GoodsDisplaySpace | null {
    return this.state.goodsDisplaySpace
  }

  public get isOnMap (): boolean {
    return this.mapSpace !== null || this.goodsDisplaySpace !== null
  }
}
