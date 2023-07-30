import { type MapSpace } from 'objects'

export class CityTileState {
  constructor (
    public readonly mapSpaceId: number | null
  ) { }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }
}
