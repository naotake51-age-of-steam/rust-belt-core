import { context } from 'game'
import { goodsDisplayLines } from 'objects'
import { type GoodsCube } from 'objects/GoodsCube'
import { type GoodsDisplayLine } from './GoodsDisplayLine'
export class GoodsDisplaySpace {
  constructor (
    public readonly id: number,
    public readonly goodsDisplayLineId: number,
    public readonly x: number,
    public readonly y: number
  ) {}

  public get goodsCube (): GoodsCube | null {
    const { g } = context()

    return g.goodsCubeStatesIndexByGoodsDisplaySpace.get(this.id)?.goodsCube ?? null
  }

  public get goodsDisplayLine (): GoodsDisplayLine {
    return goodsDisplayLines[this.goodsDisplayLineId]
  }
}
