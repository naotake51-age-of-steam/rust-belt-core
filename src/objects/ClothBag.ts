import { type GoodsCube } from './GoodsCube'

export class ClothBag {
  public get goodsCubes (): GoodsCube[] {
    throw new Error('Not implemented')
  }

  public getRandomGoodsCubes (quantity: number): GoodsCube[] {
    throw new Error('Not implemented')
  }
}
