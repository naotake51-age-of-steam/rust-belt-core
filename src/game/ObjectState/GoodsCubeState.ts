import { type MapSpace, type GoodsDisplaySpace } from 'objects'
export class GoodsCubeState {
  constructor (
    public readonly mapSpaceId: number | null, // 拡張マップで都市以外のスペースに配置する場合があるため、CityTileではなくMapSpaceに紐づける
    public readonly goodsDisplaySpaceId: number | null
  ) { }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get goodsDisplaySpace (): GoodsDisplaySpace | null {
    throw new Error('Not implemented')
  }
}
