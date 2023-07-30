import { type Player } from 'game'
import { type MapSpace, type CityTile, type TrackTile, type Town, type TownMarker } from 'objects'

export class Line {
  constructor (
    public readonly trackTileId: number,
    public readonly number: number,
    private readonly baseDirection: number
  ) {}

  public get trackTile (): TrackTile {
    throw new Error('Not implemented')
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get owner (): Player | null {
    // 敷設されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public get direction (): number {
    // 敷設されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public get cx (): number {
    // 中心座標
    // 配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public get cy (): number {
    // 中心座標
    // 配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  /**
   * 完成した線路であるか
   */
  public get isFixed (): boolean {
    throw new Error('Not implemented')
  }

  /**
   * 先端の線路であるか
   */
  public get isTip (): boolean {
    throw new Error('Not implemented')
  }

  /**
   * 外向きに接続されているオブジェクト
   * - Line: 線路に接続されている場合
   * - CityTile: 都市タイルに接続されている場合
   * - TrackTile: 線路に接続されていないが、向き先に線路タイルがある場合
   * - MapSpace: 向き先に何のタイルもない場合
   */
  public get externalLinkedObject (): Line | CityTile | TrackTile | MapSpace {
    throw new Error('Not implemented')
  }

  /**
   * 内向き接続されているオブジェクト
   * - Town: 線路タイルの町に接続される場合
   * - TownMarker: タイルマーカーに接続される場合
   * - Line: 都市を持たず、タイル内の線路に接続される場合
   */
  public get internalLinkedObject (): Town | TownMarker | Line {
    throw new Error('Not implemented')
  }

  /**
   * 内向き接続されている線路
   */
  public get internalLinkedLines (): Line[] {
    throw new Error('Not implemented')
  }

  getFollowedLine (trackTile: TrackTile, rotation: number): Line | null {
    // この線路がまだ配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }
}
