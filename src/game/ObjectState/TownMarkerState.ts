import { type TrackTile, type TownMarker, townMarkers } from 'objects'

export class TownMarkerState {
  constructor (
    public readonly id: number,
    public readonly trackTileId: number | null
  ) { }

  public get townMarker (): TownMarker {
    return townMarkers[this.id]
  }

  public get trackTile (): TrackTile | null {
    throw new Error('Not implemented')
  }
}
