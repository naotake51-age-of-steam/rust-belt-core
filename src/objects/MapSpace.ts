import { type MapSpaceType } from 'enums'
import { context } from 'game'
import { type TrackTile, type GoodsCube, type CityTile, Line, type TownMarker, getMapSpace, type Town } from 'objects'

export class MapSpace {
  constructor (
    public readonly id: number,
    public readonly type: MapSpaceType,
    public readonly image: string,
    public readonly x: number,
    public readonly y: number,
    public readonly linkedSpaceIds: [number | null, number | null, number | null, number | null, number | null, number | null]
  ) { }

  public get trackTile (): TrackTile | null {
    const { g } = context()
    return g.trackTileStatesIndexByMapSpace.get(this.id)?.trackTile ?? null
  }

  public get goodsCubes (): GoodsCube[] {
    throw new Error('Not implemented')
  }

  public get cityTile (): CityTile | null {
    const { g } = context()
    return g.cityTileStatesIndexByMapSpace.get(this.id)?.cityTile ?? null
  }

  public get townMarker (): TownMarker | null {
    const { g } = context()

    if (this.trackTile === null) return null

    return g.townMakerStatesIndexByTrackTile.get(this.trackTile.id)?.townMarker ?? null
  }

  public getLinkedSpace (direction: number): MapSpace | null {
    const spaceId = this.linkedSpaceIds[direction]

    if (spaceId === null) return null
    return getMapSpace(spaceId)
  }

  public getLinkedLine (direction: number): Line | null {
    const linkedObject = this.getLinkedObject(direction)

    return linkedObject instanceof Line ? linkedObject : null
  }

  public getLinkedTrackTile (direction: number): TrackTile | null {
    throw new Error('Not implemented')
  }

  public getLinkedCityTile (direction: number): CityTile | null {
    throw new Error('Not implemented')
  }

  public getLinkedObject (direction: number): Line | TrackTile | CityTile | MapSpace | null {
    const linkedSpace = this.getLinkedSpace(direction)
    if (linkedSpace === null) return null

    const linkedTrackTile = linkedSpace.trackTile
    if (linkedTrackTile !== null) {
      const linkedLine = linkedTrackTile.getLineByDirection((direction + 3) % 6)
      if (linkedLine !== null) {
        return linkedLine
      }
      return linkedTrackTile
    }

    const linkedCityTile = linkedSpace.cityTile
    if (linkedCityTile !== null) {
      return linkedCityTile
    }

    return linkedSpace
  }

  public getLinkedTerminalObject (direction: number): TrackTile | CityTile | MapSpace | Town | TownMarker | null {
    const linkedSpace = this.getLinkedSpace(direction)
    if (linkedSpace === null) return null

    const linkedTrackTile = linkedSpace.trackTile
    if (linkedTrackTile !== null) {
      const linkedLine = linkedTrackTile.getLineByDirection((direction + 3) % 6)
      if (linkedLine !== null) {
        const internalLinkedObject = linkedLine.internalLinkedObject
        if (internalLinkedObject instanceof Line) {
          return linkedSpace.getLinkedTerminalObject(internalLinkedObject.direction)
        }
        return internalLinkedObject
      }

      return linkedTrackTile
    }

    const linkedCityTile = linkedSpace.cityTile
    if (linkedCityTile !== null) {
      return linkedCityTile
    }

    return linkedSpace
  }
}
