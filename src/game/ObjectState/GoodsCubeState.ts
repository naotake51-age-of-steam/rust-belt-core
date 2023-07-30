import { type MapSpace, type GoodsDisplaySpace, getMapSpace, goodsDisplaySpaces } from 'objects'
export class GoodsCubeState {
  constructor (
    public readonly mapSpaceId: number | null, // 拡張マップで都市以外のスペースに配置する場合があるため、CityTileではなくMapSpaceに紐づける
    public readonly goodsDisplaySpaceId: number | null
  ) { }

  public get mapSpace (): MapSpace | null {
    if (this.mapSpaceId === null) return null

    return getMapSpace(this.mapSpaceId)
  }

  public get goodsDisplaySpace (): GoodsDisplaySpace | null {
    if (this.goodsDisplaySpaceId === null) return null

    return goodsDisplaySpaces[this.goodsDisplaySpaceId]
  }
}
