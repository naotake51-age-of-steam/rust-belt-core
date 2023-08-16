import { goodsCubes } from 'objects'
import { shuffleArray } from 'utility'
import { type GoodsCube } from './GoodsCube'

export class ClothBag {
  public get goodsCubes (): GoodsCube[] {
    return goodsCubes.filter(_ => !_.isOnMap)
  }

  public getRandomGoodsCubes (quantity: number): GoodsCube[] {
    return shuffleArray(this.goodsCubes).slice(0, quantity)
  }
}
