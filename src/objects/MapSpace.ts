import { type MapSpaceType } from 'enums'
import { type TrackTile, type GoodsCube, type CityTile, type Line } from 'objects'

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
    throw new Error('Not implemented')
  }

  public get goodsCubes (): GoodsCube[] {
    throw new Error('Not implemented')
  }

  public get cityTile (): CityTile | null {
    throw new Error('Not implemented')
  }

  public getLinkedSpace (direction: number): MapSpace | null {
    throw new Error('Not implemented')
  }

  public getLinkedLine (direction: number): Line | null {
    throw new Error('Not implemented')
  }

  public getLinkedTrackTile (direction: number): TrackTile | null {
    throw new Error('Not implemented')
  }

  public getLinkedCityTile (direction: number): CityTile | null {
    throw new Error('Not implemented')
  }

  public getLinkedObject (direction: number): Line | TrackTile | CityTile | MapSpace | null {
    throw new Error('Not implemented')
  }
}
