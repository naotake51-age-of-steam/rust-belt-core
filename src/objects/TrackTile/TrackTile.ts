import { type TrackTileType, MapSpaceType } from 'enums'
import { type TrackTileState, type Player, context } from 'game'
import { MapSpace, Line, type TownMarker, type Town, townMarkers, CityTile } from 'objects'

export abstract class TrackTile {
  constructor (
    public readonly id: number,
    public readonly type: TrackTileType,
    public readonly image: string,
    public readonly lines: Line[]
  ) {}

  public get state (): TrackTileState {
    const { g } = context()
    return g.trackTileStates[this.id]
  }

  public get mapSpace (): MapSpace | null {
    return this.state.mapSpace
  }

  public get isPlaced (): boolean {
    return this.mapSpace !== null
  }

  public get rotation (): number {
    const rotation = this.state.rotation
    if (rotation === null) {
      throw new Error('Not placed')
    }
    return rotation
  }

  public getLineByDirection (direction: number): Line | null {
    return this.lines.find(_ => _.direction === direction) ?? null
  }

  public getLineByNumber (number: number): Line {
    throw new Error('Not implemented')
  }

  public get lineDirections (): number[] {
    return this.lines.map(_ => _.direction)
  }

  public getLineDirections (rotation: number): number[] {
    return this.lines.map(_ => _.getDirection(rotation))
  }

  public abstract get pairLines (): Array<[Line, Line]>

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

export function existsRemainTownMarker (): boolean {
  return townMarkers.find(_ => !_.isPlaced) !== undefined
}

export function existsUnFollowLine (targetLines: Line[], rotation: number, lines: Line[]): boolean {
  const directions = lines.map(_ => _.getDirection(rotation))

  return targetLines.some(_ => !directions.includes(_.direction))
}

export function existsValidLink (player: Player, mapSpace: MapSpace, rotation: number, lines: Line[]): boolean {
  return lines.some(_ => {
    const linkedObject = mapSpace.getLinkedObject(_.getDirection(rotation))
    if (linkedObject === null) return false

    if (linkedObject instanceof Line) {
      if (linkedObject.owner === null || linkedObject.owner.is(player)) {
        return true
      }
    }

    if (linkedObject instanceof CityTile) {
      return true
    }

    return false
  })
}

export function existsInvalidLink (player: Player, mapSpace: MapSpace, rotation: number, lines: Line[]): boolean {
  return lines.some(_ => {
    const linkedObject = mapSpace.getLinkedObject(_.getDirection(rotation))
    if (linkedObject === null) return true // マップ外

    if (linkedObject instanceof MapSpace && linkedObject.type === MapSpaceType.LAKE) return true // 湖に接続

    if (linkedObject instanceof Line) {
      if (linkedObject.owner !== null && !linkedObject.owner.is(player)) {
        return true
      }
    }
    return false
  })
}

export function isSameTrackTileReplace (placed: TrackTile, replacing: TrackTile, rotation: number): boolean {
  if (placed.type !== replacing.type) return false

  if (placed.rotation === rotation) return true

  const placedLineDirections = placed.lineDirections
  const placingLineDirections = placed.getLineDirections(rotation)

  return new Set([...placedLineDirections, ...placingLineDirections]).size === placedLineDirections.length
}
