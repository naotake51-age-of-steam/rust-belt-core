import { type GoodsDisplayLine } from './GoodsDisplayLine'

export class GoodsDisplay {
  constructor (
    public readonly GoodsDisplayLinesList: GoodsDisplayLine[][]
  ) {}

  public getGoodsDisplayLinesByDice (dice: number): GoodsDisplayLine[] {
    throw new Error('Not implemented')
  }
}
