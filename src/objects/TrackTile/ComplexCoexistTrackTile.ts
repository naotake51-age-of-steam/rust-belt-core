import { type TrackTileType, MapSpaceType } from 'enums'
import { type Line, type MapSpace } from 'objects'
import { BaseTrackTile } from './BaseTrackTile'

export class ComplexCoexistTrackTile extends BaseTrackTile {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    id: number,
    type: TrackTileType,
    image: string,
    public readonly lines: [Line, Line, Line, Line]
  ) {
    super(id, type, image, lines)
  }

  public get pairLines (): Array<[Line, Line]> {
    return [[this.lines[0], this.lines[1]], [this.lines[2], this.lines[3]]]
  }

  /**
   * 敷設コスト
   */
  public calculateCostOfPlaceToMapSpace (mapSpace: MapSpace): number {
    switch (mapSpace.type) {
      case MapSpaceType.TOWN:
        return 1 + 4
      case MapSpaceType.PLAIN:
        return 3
      case MapSpaceType.LAKE:
        return 4
      case MapSpaceType.MOUNTAIN:
        return 5
      default:
        throw new Error('logic error')
    }
  }

  /**
   * 置き換えコスト
   */
  public calculateCostOfReplaceToMapSpace (mapSpace: MapSpace): number {
    if (mapSpace.type === MapSpaceType.TOWN) return 3

    return 2
  }
}
