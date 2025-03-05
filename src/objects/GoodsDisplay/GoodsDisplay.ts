import { type GoodsDisplayLine } from './GoodsDisplayLine'

export class GoodsDisplay {
  constructor (
    public readonly goodsDisplayLinesList: GoodsDisplayLine[][]
  ) {}

  public getGoodsDisplayLinesByDice (dice: number): GoodsDisplayLine[] {
    return this.goodsDisplayLinesList[dice - 1]
  }
}
