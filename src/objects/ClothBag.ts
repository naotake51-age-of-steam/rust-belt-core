import { goodsCubes } from 'objects'
import { type GoodsCube } from './GoodsCube'

export class ClothBag {
  public get goodsCubes (): GoodsCube[] {
    return goodsCubes.filter(_ => !_.isOnMap)
  }

  public getRandomGoodsCubes (quantity: number): GoodsCube[] {
    throw new Error('Not implemented')
  }
}
