import { MapSpaceType, PlacedLineType } from 'enums'
import { type Player, context } from 'game'
import { type MapSpace, CityTile, type TrackTile, Town, TownMarker, trackTiles } from 'objects'

interface PlacedNewLine {
  type: PlacedLineType.NEW_LINE
}

interface PlacedReplaceLine {
  type: PlacedLineType.REPLACE_LINE
  srcLine: Line
}

interface PlacedRedirectLine {
  type: PlacedLineType.REDIRECT_LINE
  srcLine: Line
  srcPairLine: Line
}

export type PlacedLine = PlacedNewLine | PlacedReplaceLine | PlacedRedirectLine

export class Line {
  constructor (
    public readonly trackTileId: number,
    public readonly number: number,
    private readonly baseDirection: number
  ) {}

  public get trackTile (): TrackTile {
    return trackTiles[this.trackTileId]
  }

  public get mapSpace (): MapSpace | null {
    throw new Error('Not implemented')
  }

  public get owner (): Player | null {
    const { g } = context()
    const lineOwners = g.trackTileStates[this.trackTileId].lineOwners
    if (lineOwners === null) throw new Error('Not placed')

    const ownerPlayerId = lineOwners[this.number]
    if (ownerPlayerId === null) return null

    return g.players[ownerPlayerId]
  }

  public get direction (): number {
    return (this.trackTile.rotation + this.baseDirection) % 6
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
    if (this.mapSpace === null) throw new Error('Not placed')

    const terminalObject = this.mapSpace.getLinkedTerminalObject(this.direction)
    const isFixedTerminal = terminalObject instanceof CityTile || terminalObject instanceof TownMarker || terminalObject instanceof Town
    if (!isFixedTerminal) return false

    const internalLinkedObject = this.internalLinkedObject
    if (internalLinkedObject instanceof Line) {
      const internalTerminalObject = this.mapSpace.getLinkedTerminalObject(internalLinkedObject.direction)
      const isFixedInternalTerminal = internalTerminalObject instanceof CityTile || internalTerminalObject instanceof TownMarker || internalTerminalObject instanceof Town
      if (!isFixedInternalTerminal) return false
    }

    return true
  }

  /**
   * 先端の線路であるか
   */
  public get isTip (): boolean {
    return !(this.externalLinkedObject instanceof Line) && !(this.externalLinkedObject instanceof CityTile)
  }

  public get isPlaced (): boolean {
    return this.trackTile.isPlaced
  }

  /**
   * 外向きに接続されているオブジェクト
   * - Line: 線路に接続されている場合
   * - CityTile: 都市タイルに接続されている場合
   * - TrackTile: 線路に接続されていないが、向き先に線路タイルがある場合
   * - MapSpace: 向き先に何のタイルもない場合
   */
  public get externalLinkedObject (): Line | CityTile | TrackTile | MapSpace {
    const mapSpace = this.trackTile.mapSpace
    if (mapSpace === null) throw new Error('Not placed')

    const linkedObject = mapSpace.getLinkedObject(this.direction)
    if (linkedObject === null) throw new Error('invalid placed line')

    return linkedObject
  }

  /**
   * 内向き接続されているオブジェクト
   * - Town: 線路タイルの町に接続される場合
   * - TownMarker: タイルマーカーに接続される場合
   * - Line: 都市を持たず、タイル内の線路に接続される場合
   */
  public get internalLinkedObject (): Town | TownMarker | Line {
    if (!this.isPlaced) throw new Error('Not placed')

    const town = this.trackTile.town
    if (town !== null) return town

    const pairLine = this.pairLine
    if (pairLine !== null) return pairLine

    throw new Error('logic error')
  }

  public get pairLine (): Line | null {
    for (const [line1, line2] of this.trackTile.pairLines) {
      if (this.equal(line1)) return line2
      if (this.equal(line2)) return line1
    }
    return null
  }

  /**
   * 内向き接続されている線路
   */
  public get internalLinkedLines (): Line[] {
    const linkedLines = []
    const internalLinkedObject = this.internalLinkedObject
    if (internalLinkedObject instanceof Line) {
      linkedLines.push(internalLinkedObject)

      const externalLinkedObject = internalLinkedObject.externalLinkedObject
      if (externalLinkedObject instanceof Line) {
        linkedLines.push(externalLinkedObject)
        externalLinkedObject.internalLinkedLines.forEach(_ => linkedLines.push(_))
      }
    }

    return linkedLines
  }

  public equal (line: Line): boolean {
    return this.trackTileId === line.trackTileId && this.number === line.number
  }

  public getFollowedLine (trackTile: TrackTile, rotation: number): Line | null {
    // この線路がまだ配置されていない場合は例外を投げる
    throw new Error('Not implemented')
  }

  public getDirection (rotation: number): number {
    return (this.baseDirection + rotation) % 6
  }

  /** 配置タイプ */
  public determinePlacedLineType (mapSpace: MapSpace, rotation: number): PlacedLine {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')

    const srcTrackTile = mapSpace.trackTile
    if (srcTrackTile === null) {
      return { type: PlacedLineType.NEW_LINE }
    } else {
      const srcLine = srcTrackTile.getLineByDirection(this.getDirection(rotation))
      if (srcLine !== null) return { type: PlacedLineType.REPLACE_LINE, srcLine }

      // 町スペース以外の場合は、方向転換が可能なのでそのチェックが必要
      if (mapSpace.type !== MapSpaceType.TOWN) {
        if (this.pairLine === null) throw new Error('logic error')
        const srcPairLine = srcTrackTile.getLineByDirection(this.pairLine.getDirection(rotation))
        if (srcPairLine !== null) {
          if (srcPairLine.pairLine === null) throw new Error('logic error')
          return { type: PlacedLineType.REDIRECT_LINE, srcLine: srcPairLine.pairLine, srcPairLine }
        }
      }

      return { type: PlacedLineType.NEW_LINE }
    }
  }
}
