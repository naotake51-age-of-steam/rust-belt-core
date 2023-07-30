import { type Player } from 'game'
import { type Line } from 'objects'

export class GameMap {
  public getIncompleteLines (owner: Player): Line[] {
    // 未完成の線路の先端Lineのみを返す
    throw new Error('Not implemented')
  }
}

export const gameMap = new GameMap()
