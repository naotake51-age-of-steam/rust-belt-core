import { type Player } from 'game'
import { type MapSpace } from 'objects'

export class TrackTileState {
  constructor (
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

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public getLineOwner (number: number): Player | null {
    throw new Error('Not implemented')
  }
}
