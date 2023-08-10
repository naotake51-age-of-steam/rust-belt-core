import { type Player, context } from 'game'
import { type MapSpace, CityTile, type TrackTile, type Town, type TownMarker, trackTiles } from 'objects'

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
    throw new Error('Not implemented')
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
    throw new Error('Not implemented')
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
}
