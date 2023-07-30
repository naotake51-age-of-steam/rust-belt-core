import { type TrackTileState } from 'game'
import { type MapSpace, type Line, type TownMarker, type Town } from 'objects'

export abstract class TrackTile {
  constructor (
    public readonly id: number,
    public readonly image: string,
    public readonly lines: Line[]
  ) {}

  public get state (): TrackTileState {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get rotation (): number {
    // 配置されていないタイルの場合は例外を投げる
    throw new Error('Not implemented')
  }

  public getLineByDirection (direction: number): Line | null {
    throw new Error('Not implemented')
  }

  public getLineByNumber (number: number): Line {
    throw new Error('Not implemented')
  }

  public abstract get town (): TownMarker | Town | null

  /**
   * 敷設が可能か
   */
  public abstract canPlaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean

  /**
   * 敷設コスト
   */
  public abstract calculateCostOfPlaceToMapSpace (mapSpace: MapSpace): number

  /**
   * 置き換えもしくは方向転換が可能か
   */
  public abstract canReplaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean

  /**
   * 置き換えコスト
   */
  public abstract calculateCostOfReplaceToMapSpace (mapSpace: MapSpace): number
}
