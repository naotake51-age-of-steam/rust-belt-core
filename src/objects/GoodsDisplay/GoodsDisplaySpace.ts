import { type GoodsDisplayLine } from './GoodsDisplayLine'
export class GoodsDisplaySpace {
  constructor (
    public readonly id: number,
    public readonly goodsDisplayLineId: number,
    public readonly x: number,
    public readonly y: number
  ) {}

  public get goodsDisplayLine (): GoodsDisplayLine {
    throw new Error('Not implemented')
  }
}
