import { type TrackTile, type MapSpace } from 'objects'

export class TownMarker {
  constructor (
    public readonly id: number
  ) {}

  public get trackTile (): TrackTile | null {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }
}
