import { trackTiles, type MapSpace, type TrackTile } from 'objects'
export class Town {
  constructor (
    public readonly trackTileId: number
  ) {}

  public get trackTile (): TrackTile {
    return trackTiles[this.trackTileId]
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }
}
