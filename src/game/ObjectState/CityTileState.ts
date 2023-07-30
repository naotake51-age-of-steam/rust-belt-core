import { getMapSpace, type MapSpace } from 'objects'

export class CityTileState {
  constructor (
    public readonly mapSpaceId: number | null
  ) { }

  public get mapSpace (): MapSpace | null {
    if (this.mapSpaceId === null) return null

    return getMapSpace(this.mapSpaceId)
  }
}
