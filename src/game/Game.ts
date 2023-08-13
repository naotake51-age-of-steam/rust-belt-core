import { type Player, type GoodsCubeState, type TrackTileState, type CityTileState, type TownMarkerState, type Phase, type User } from 'game'
import { type MapSpace, type TrackTile, type CityTile, type GoodsCube, type TownMarker } from 'objects'
import { createUniqueIndex, createIndex } from 'utility'

export class Game {
  public readonly trackTileStatesIndexByMapSpace: Map<number, TrackTileState>
  public readonly cityTileStatesIndexByMapSpace: Map<number, CityTileState>
  public readonly goodsCubeStatesIndexByMapSpace: Map<number, GoodsCubeState[]>
  public readonly goodsCubeStatesIndexByGoodsDisplaySpace: Map<number, GoodsCubeState>
  public readonly townMakerStatesIndexByTrackTile: Map<number, TownMarkerState>

  constructor (
    public readonly id: string,
    public readonly adminUser: User,
    public readonly users: User[],
    public readonly round: number,
    public readonly phase: Phase,
    public readonly players: Player[], // ゲームが始まったら順序固定
    public readonly turnPlayerId: number,
    public readonly trackTileStates: TrackTileState[],
    public readonly cityTileStates: CityTileState[],
    public readonly goodsCubeStates: GoodsCubeState[],
    public readonly townMakerStates: TownMarkerState[],
    public readonly histories: Array<{ id: string, fixed: boolean }>
  ) {
    this.trackTileStatesIndexByMapSpace = createUniqueIndex(trackTileStates, 'mapSpaceId')
    this.cityTileStatesIndexByMapSpace = createUniqueIndex(cityTileStates, 'mapSpaceId')
    this.goodsCubeStatesIndexByMapSpace = createIndex(goodsCubeStates, 'mapSpaceId')
    this.goodsCubeStatesIndexByGoodsDisplaySpace = createUniqueIndex(goodsCubeStates, 'goodsDisplaySpaceId')
    this.townMakerStatesIndexByTrackTile = createUniqueIndex(townMakerStates, 'trackTileId')
  }

  public getTrackTileByMapSpace (mapSpace: MapSpace): TrackTile | null {
    throw new Error('Not implemented')
  }

  public getCityTileByMapSpace (mapSpace: MapSpace): CityTile | null {
    throw new Error('Not implemented')
  }

  public getGoodsCubesByMapSpace (mapSpace: MapSpace): GoodsCube[] {
    throw new Error('Not implemented')
  }

  public getTownMakerByTrackTile (trackTile: TrackTile): TownMarker | null {
    throw new Error('Not implemented')
  }

  public get turnPlayer (): Player {
    return this.players[this.turnPlayerId]
  }

  public get message (): string {
    return this.phase.message
  }

  public canUndo (): boolean {
    throw new Error('Not implemented')
  }

  public actionUndo (): Game {
    throw new Error('Not implemented')
  }

  public actionDestroy (): Game {
    throw new Error('Not implemented')
  }

  public deepCopy (): Game {
    return new Game(
      this.id,
      this.adminUser.deepCopy(),
      this.users.map(_ => _.deepCopy()),
      this.round,
      this.phase.deepCopy(),
      this.players.map(_ => _.deepCopy()),
      this.turnPlayerId,
      this.trackTileStates.map(_ => _.deepCopy()),
      this.cityTileStates.map(_ => _.deepCopy()),
      this.goodsCubeStates.map(_ => _.deepCopy()),
      this.townMakerStates.map(_ => _.deepCopy()),
      [...this.histories]
    )
  }
}
