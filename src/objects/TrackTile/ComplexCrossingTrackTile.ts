import { type Line, type TownMarker, type MapSpace } from 'objects'
import { TrackTile } from './TrackTile'

export class ComplexCrossingTrackTile extends TrackTile {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    id: number,
    image: string,
    lines: [Line, Line, Line, Line]
  ) {
    super(id, image, lines)
  }

  public get town (): TownMarker | null {
    // 配置されていないタイルの場合は例外を投げる
    throw new Error('Not implemented')
  }

  /**
   * 敷設が可能か
   */
  public canPlaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    /**
     * - 指定箇所にタイルがない
     * - プレイヤーが線路を敷設するコストを払える
     * - 町スペースの場合
     *   - TownMarkerが残っている
     * - 未接続となる線路がない
     * - 他プレイヤーの先端線路に接続してしまう線路がない
     */
    throw new Error('Not implemented')
  }

  /**
   * 敷設コスト
   */
  public calculateCostOfPlaceToMapSpace (mapSpace: MapSpace): number {
    throw new Error('Not implemented')
  }

  /**
   * 置き換えもしくは方向転換が可能か
   */
  public canReplaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    /**
     * - 指定箇所にタイルがある
     * - 同じタイプ、同じ向きのタイルでないこと
     * - プレイヤーが線路の置き換えコストを払える
     * - フォローされない線路がない
     * - 未接続となる線路がない
     * - 他プレイヤーの先端線路に接続してしまう線路がない
     */
    throw new Error('Not implemented')
  }

  /**
   * 置き換えコスト
   */
  public calculateCostOfReplaceToMapSpace (mapSpace: MapSpace): number {
    throw new Error('Not implemented')
  }

  /**
   * - フォローされない線路があるか（自身もしくは所有権なし先端線路以外が対象）
   *   - 町スペースの場合（線路ペアを考慮する必要なし）
   *   - 町スペース以外の場合（線路ペアを考慮する必要あり）
   */
  public hasUnFollowed (mapSpace: MapSpace, rotation: number): boolean {
    throw new Error('Not implemented')
  }

  /**
   * - 未接続となる線路があるか
   *   - 以下のいづれかを満たす
   *     - 町スペースでタイルがすでに置かれている
   *     - 線路の片端が既存の線路、都市に接続されていること
   */
  public hasUnLinkedLine (mapSpace: MapSpace, rotation: number): boolean {
    throw new Error('Not implemented')
  }

  /**
   * - 他プレイヤーの先端線路に接続してしまう線路があるか
   */
  public hasLinkedOtherPlayerTipLine (mapSpace: MapSpace, rotation: number): boolean {
    throw new Error('Not implemented')
  }
}
