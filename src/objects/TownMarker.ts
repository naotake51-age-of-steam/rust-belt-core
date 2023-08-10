import { type TownMarkerState, context } from 'game'
import { type TrackTile, type MapSpace } from 'objects'

export class TownMarker {
  constructor (
    public readonly id: number
  ) {}

  public get state (): TownMarkerState {
    const { g } = context()

    return g.townMakerStates[this.id]
  }

  public get trackTile (): TrackTile | null {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    return this.state.trackTile?.mapSpace ?? null
  }

  public get isPlaced (): boolean {
    return this.mapSpace !== null
  }
}
