import { type Player } from 'game'
import { trackTiles, type MapSpace, type TrackTile, getMapSpace } from 'objects'

export class TrackTileState {
  constructor (
    public readonly id: number,
    public readonly mapSpaceId: number | null,
    public readonly rotation: number | null,
    public readonly lineOwners: Array<number | null> | null
  ) {
    if (rotation !== null) {
      if (rotation < 0 || rotation > 5) {
        throw new Error('Invalid rotation')
      }
    }
  }

  public deepCopy (): TrackTileState {
    return new TrackTileState(
      this.id,
      this.mapSpaceId,
      this.rotation,
      this.lineOwners !== null ? [...this.lineOwners] : null
    )
  }

  public get trackTile (): TrackTile {
    return trackTiles[this.id]
  }

  public get mapSpace (): MapSpace | null {
    if (this.mapSpaceId === null) return null

    return getMapSpace(this.mapSpaceId)
  }

  public getLineOwner (number: number): Player | null {
    throw new Error('Not implemented')
  }
}
