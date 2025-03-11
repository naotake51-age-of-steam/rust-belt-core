import { CityTileColor, GoodsCubeColor, MapSpaceType } from 'enums'
import { type CityTileState, context } from 'game'
import { type MapSpace, type GoodsCube, type Line } from 'objects'

export class CityTile {
  constructor (
    public readonly id: number,
    public readonly image: string,
    public readonly color: CityTileColor,
    public readonly initialize: { mapSpaceId: number, goodsCubesQuantity: number } | null = null
  ) {}

  public get state (): CityTileState {
    const { g } = context()

    return g.cityTileStates[this.id]
  }

  public get mapSpace (): MapSpace | null {
    return this.state.mapSpace
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

  public get isPlaced (): boolean {
    return this.mapSpace !== null
  }

  public isAcceptGoodsCube (goodsCube: GoodsCube): boolean {
    switch (this.color) {
      case CityTileColor.RED:
        return goodsCube.color === GoodsCubeColor.RED
      case CityTileColor.BLUE:
        return goodsCube.color === GoodsCubeColor.BLUE
      case CityTileColor.PURPLE:
        return goodsCube.color === GoodsCubeColor.PURPLE
      case CityTileColor.YELLOW:
        return goodsCube.color === GoodsCubeColor.YELLOW
      case CityTileColor.BLACK:
        return goodsCube.color === GoodsCubeColor.BLACK
      default:
        throw new Error('logic')
    }
  }

  /**
   * 敷設が可能か
   */
  public canPlaceToMapSpace (mapSpace: MapSpace): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')

    // 町スペース以外
    if (mapSpace.type !== MapSpaceType.TOWN) return false

    // すでに都市タイルが引かれている
    if (mapSpace.cityTile !== null) return false

    return true
  }
}
