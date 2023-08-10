import { type TrackTileType, MapSpaceType } from 'enums'
import { context } from 'game'
import { type Line, type MapSpace, TownMarker, Town, CityTile } from 'objects'
import { TrackTile, existsRemainTownMarker, existsValidLink, existsInvalidLink, existsUnFollowLine, isSameTrackTileReplace } from './TrackTile'

export abstract class BaseTrackTile extends TrackTile {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    id: number,
    type: TrackTileType,
    image: string,
    lines: Line[]
  ) {
    super(id, type, image, lines)
  }

  public get town (): TownMarker | null {
    if (!this.isPlaced) throw new Error('Not placed')

    return this.mapSpace?.townMarker ?? null
  }

  public abstract get pairLines (): Array<[Line, Line]>

  /**
   * 敷設が可能か
   */
  public canPlaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    // スペースにタイルがある
    if (mapSpace.trackTile !== null) return false

    // 都市スペース
    if (mapSpace.type === MapSpaceType.CITY) return false

    // 支払い不可
    if (this.calculateCostOfPlaceToMapSpace(mapSpace) > p.money) return false

    // 町スペース配置だが、TownMarkerが残っていない
    if (mapSpace.type === MapSpaceType.TOWN) {
      if (!existsRemainTownMarker()) return false
    }

    // 接続されてない線路がでてしまう
    if (mapSpace.type === MapSpaceType.TOWN) {
      if (!existsValidLink(p, mapSpace, rotation, this.lines)) return false
    } else {
      if (this.pairLines.some(_ => !existsValidLink(p, mapSpace, rotation, _))) return false
    }

    // 許可されない接続ができてしまう
    if (existsInvalidLink(p, mapSpace, rotation, this.lines)) return false

    // タイル配置によってループ線路ができてしまう
    if (this.detectLoopLine(mapSpace, rotation)) return false

    return true
  }

  /**
   * 敷設コスト
   */
  public abstract calculateCostOfPlaceToMapSpace (mapSpace: MapSpace): number

  /**
   * 置き換えもしくは方向転換が可能か
   */
  public canReplaceToMapSpace (mapSpace: MapSpace, rotation: number): boolean {
    const { p } = context()

    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    // スペースにタイルがない
    if (mapSpace.trackTile === null) return false

    // 同じタイプ、同じ向きのタイル
    if (isSameTrackTileReplace(mapSpace.trackTile, this, rotation)) return false

    // 都市スペース
    if (mapSpace.type === MapSpaceType.CITY) return false

    // 支払い不可
    if (this.calculateCostOfReplaceToMapSpace(mapSpace) > p.money) return false

    // 町スペースの置き換えだが、TownMarkerが残っていない
    if (mapSpace.type === MapSpaceType.TOWN) {
      if (!existsRemainTownMarker() && mapSpace.townMarker === null) return false
    }

    // 接続されてない線路がでてしまう
    if (mapSpace.type === MapSpaceType.TOWN) {
      // 町のタイルを置き換える場合は自身の線路に接続されていなくてもよい。
    } else {
      if (this.pairLines.some(_ => !existsValidLink(p, mapSpace, rotation, _))) return false
    }

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
  public abstract calculateCostOfReplaceToMapSpace (mapSpace: MapSpace): number

  /**
   * フォローされない線路があるか
   */
  public hasUnFollowed (mapSpace: MapSpace, rotation: number): boolean {
    if (mapSpace.trackTile === null) return false

    if (mapSpace.type === MapSpaceType.TOWN) {
      if (existsUnFollowLine(mapSpace.trackTile.lines, rotation, this.lines)) return true
    } else {
      if (mapSpace.trackTile.pairLines.some(
        // 方向転換できるので先端線路以外が対象
        _ => this.pairLines.every(lines => existsUnFollowLine(_.filter(_ => !_.isTip), rotation, lines))
      )) return true
    }
    return false
  }

  /**
   * タイル配置によってループ線路ができてしまうか
   */
  public detectLoopLine (mapSpace: MapSpace, rotation: number): boolean {
    if (mapSpace.type === MapSpaceType.TOWN) {
      // 自身の町に戻ってくる
      if (this.getLineDirections(rotation).some(_ => {
        const terminal = mapSpace.getLinkedTerminalObject(_)
        // MEMO:: 新規配置で循環するケースはないはずなのでMapSpaceのチェックは不要
        if (terminal instanceof Town && terminal.trackTileId === mapSpace.trackTile?.id) return true
        if (terminal instanceof TownMarker && terminal.id === mapSpace.townMarker?.id) return true

        return false
      })) return true
    } else {
      // 同じ都市、町につながる
      if (this.pairLines.some(_ => {
        const terminal0 = mapSpace.getLinkedTerminalObject(_[0].getDirection(rotation))
        const terminal1 = mapSpace.getLinkedTerminalObject(_[1].getDirection(rotation))

        if (terminal0 instanceof CityTile && terminal1 instanceof CityTile && terminal0.id === terminal1.id) return true
        if (terminal0 instanceof Town && terminal1 instanceof Town && terminal0.trackTileId === terminal1.trackTileId) return true
        if (terminal0 instanceof TownMarker && terminal1 instanceof TownMarker && terminal0.id === terminal1.id) return true

        return false
      })) return true
    }

    return false
  }
}
