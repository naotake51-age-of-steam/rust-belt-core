import { type TrackTile, type TownMarker, townMarkers, trackTiles } from 'objects'

export class TownMarkerState {
  constructor (
    public readonly id: number,
    public readonly trackTileId: number | null
  ) { }

  public get townMarker (): TownMarker {
    return townMarkers[this.id]
  }

  public get trackTile (): TrackTile | null {
    if (this.trackTileId === null) return null
    return trackTiles[this.trackTileId]
  }
}
