import { type TrackTile } from 'objects'

export class TownMarkerState {
  constructor (
    public readonly trackTileId: number | null
  ) { }

  public get trackTile (): TrackTile | null {
    throw new Error('Not implemented')
  }
}
