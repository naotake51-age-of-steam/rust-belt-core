import { type CityTile, type GoodsCube } from 'objects'
import { type GoodsDisplaySpace } from './GoodsDisplaySpace'

export class GoodsDisplayLine {
  constructor (
    public readonly id: number,
    public readonly cityTile: CityTile,
    public readonly goodsDisplaySpaces: GoodsDisplaySpace[]
  ) {}

  public getGoodsCubes (quantity: number): GoodsCube[] {
    throw new Error('Not implemented')
  }
}
