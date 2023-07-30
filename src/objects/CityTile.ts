import { type CityTileColor } from 'enums'
import { type CityTileState } from 'game'
import { type MapSpace, type GoodsCube, type Line } from 'objects'

export class CityTile {
  constructor (
    public readonly id: number,
    public readonly image: string,
    public readonly color: CityTileColor,
    public readonly initialize: { mapSpaceId: number, goodsCubesQuantity: number } | null = null
  ) {}

  public get state (): CityTileState {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get goodsCubes (): GoodsCube[] {
    throw new Error('Not implemented')
  }

  public get cx (): number {
    // 中心座標
    // 配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public get cy (): number {
    // 中心座標
    // 配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public get linkedLines (): Line[] {
    throw new Error('Not implemented')
  }

  public get linkedFixedLines (): Line[] {
    throw new Error('Not implemented')
  }
}
