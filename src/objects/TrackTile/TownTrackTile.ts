import { type TrackTileType, MapSpaceType } from 'enums'
import { context } from 'game'
import { type Line, Town, type MapSpace, TownMarker } from 'objects'
import { TrackTile, existsValidLink, existsInvalidLink, existsUnFollowLine } from './TrackTile'

export class TownTrackTile extends TrackTile {
  constructor (
    id: number,
    type: TrackTileType,
    image: string,
    lines: Line[],
    public readonly town: Town
  ) {
    super(id, type, image, lines)
  }

  public get pairLines (): Array<[Line, Line]> {
    throw new Error('logic error')
  }

  /**
   * 敷設が可能か
   */
  public canPlaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    // スペースにタイルがある
    if (mapSpace.trackTile !== null) return false

    // 町スペース以外
    if (mapSpace.type !== MapSpaceType.TOWN) return false

    // 支払い不可
    if (this.calculateCostOfPlaceToMapSpace(mapSpace) > p.money) return false

    // 接続されてない町タイルになる
    if (!existsValidLink(p, mapSpace, rotation, this.lines)) return false

    // 許可されない接続ができてしまう
    if (existsInvalidLink(p, mapSpace, rotation, this.lines)) return false

    // タイル配置によってループ線路ができてしまう
    if (this.detectLoopLine(mapSpace, rotation)) return false

    return true
  }

  /**
   * 敷設コスト
   */
  public calculateCostOfPlaceToMapSpace (mapSpace: MapSpace): number {
    return 1 + this.lines.length
  }

  /**
   * 置き換えもしくは方向転換が可能か
   */
  public canReplaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    // スペースにタイルがない
    if (mapSpace.trackTile === null) return false

    // 町スペース以外
    if (mapSpace.type !== MapSpaceType.TOWN) return false

    // 支払い不可
    if (this.calculateCostOfReplaceToMapSpace(mapSpace) > p.money) return false

    // 許可されない接続ができてしまう
    const directions = mapSpace.trackTile.lineDirections
    const newLines = this.lines.filter(_ => !directions.includes(_.getDirection(rotation))) // 新たに追加される/方向転換される線路
    if (existsInvalidLink(p, mapSpace, rotation, newLines)) return false

    // 置き換えでフォローさない線路がある
    if (this.hasUnFollowed(mapSpace, rotation)) return false

    // タイル配置によってループ線路ができてしまう
    if (this.detectLoopLine(mapSpace, rotation)) return false

    return true
  }

  /**
   * 置き換えコスト
   */
  public calculateCostOfReplaceToMapSpace (mapSpace: MapSpace): number {
    return 3
  }

  /**
   * - フォローされない線路があるか（自身もしくは所有権なし先端線路以外が対象）
   *   - 町スペースの場合（線路ペアを考慮する必要なし）
   *   - 町スペース以外の場合（線路ペアを考慮する必要あり）
   */
  public hasUnFollowed (mapSpace: MapSpace, rotation: number): boolean {
    if (mapSpace.trackTile === null) return false

    return existsUnFollowLine(mapSpace.trackTile.lines, rotation, this.lines)
  }

  /**
   * タイル配置によってループ線路ができてしまうか
   */
  public detectLoopLine (mapSpace: MapSpace, rotation: number): boolean {
    // 自身の町に戻ってくる
    if (this.getLineDirections(rotation).some(_ => {
      const terminal = mapSpace.getLinkedTerminalObject(_)
      // MEMO:: 新規配置で循環するケースはないはずなのでMapSpaceのチェックは不要
      if (terminal instanceof Town && terminal.trackTileId === mapSpace.trackTile?.id) return true
      if (terminal instanceof TownMarker && terminal.id === mapSpace.townMarker?.id) return true

      return false
    })) return true

    return false
  }
}
