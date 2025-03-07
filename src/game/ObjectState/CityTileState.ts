import { State } from 'game/State'
import { getMapSpace, type MapSpace, cityTiles, type CityTile } from 'objects'

export class CityTileState extends State {
  constructor (
    public readonly id: number,
    public readonly mapSpaceId: number | null
  ) {
    super()
  }

  public get cityTile (): CityTile {
    return cityTiles[this.id]
  }

  public get mapSpace (): MapSpace | null {
    if (this.mapSpaceId === null) return null

    return getMapSpace(this.mapSpaceId)
  }
}
