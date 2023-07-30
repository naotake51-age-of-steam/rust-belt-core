import { type GoodsCubeColor } from 'enums'
import { type GoodsCubeState } from 'game'
import { type MapSpace } from 'objects'
import { type GoodsDisplaySpace } from './GoodsDisplay'

export class GoodsCube {
  constructor (
    public readonly id: number,
    public readonly color: GoodsCubeColor
  ) {}

  public get state (): GoodsCubeState {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get goodsDisplaySpace (): GoodsDisplaySpace | null {
    throw new Error('Not implemented')
  }
}
