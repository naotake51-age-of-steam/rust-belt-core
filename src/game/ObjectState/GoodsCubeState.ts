import { State } from 'game/State'
import { type MapSpace, type GoodsDisplaySpace, getMapSpace, goodsDisplaySpaces, goodsCubes, type GoodsCube } from 'objects'
export class GoodsCubeState extends State {
  constructor (
    public readonly id: number,
    public readonly mapSpaceId: number | null, // 拡張マップで都市以外のスペースに配置する場合があるため、CityTileではなくMapSpaceに紐づける
    public readonly goodsDisplaySpaceId: number | null
  ) {
    super()
  }

  public get goodsCube (): GoodsCube {
    return goodsCubes[this.id]
  }

  public get mapSpace (): MapSpace | null {
    if (this.mapSpaceId === null) return null

    return getMapSpace(this.mapSpaceId)
  }

  public get goodsDisplaySpace (): GoodsDisplaySpace | null {
    if (this.goodsDisplaySpaceId === null) return null

    return goodsDisplaySpaces[this.goodsDisplaySpaceId]
  }
}
