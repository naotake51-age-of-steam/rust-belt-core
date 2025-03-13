import { type CityTile, type GoodsCube } from 'objects'
import { type GoodsDisplaySpace } from './GoodsDisplaySpace'

export class GoodsDisplayLine {
  constructor (
    public readonly id: number,
    public readonly label: string,
    public readonly cityTile: CityTile,
    public readonly goodsDisplaySpaces: GoodsDisplaySpace[]
  ) {}

  public getGoodsCubes (quantity: number): GoodsCube[] {
    const goodsCubes = this.goodsDisplaySpaces.map(_ => _.goodsCube).filter(_ => _ !== null)

    return goodsCubes.slice(0, quantity)
  }
}
