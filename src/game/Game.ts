import 'reflect-metadata'
import { Type } from 'class-transformer'
import { User, Player, GoodsCubeState, TrackTileState, CityTileState, TownMarkerState, type Phase } from 'game'
import { type MapSpace, type TrackTile, type CityTile, type GoodsCube, type TownMarker } from 'objects'
import { createUniqueIndex, createIndex } from 'utility'
import { State } from './State'

export class Game extends State {
  protected __trackTileStatesIndexByMapSpace?: Map<number, TrackTileState>
  private __cityTileStatesIndexByMapSpace?: Map<number, CityTileState>
  private __goodsCubeStatesIndexByMapSpace?: Map<number, GoodsCubeState[]>
  private __goodsCubeStatesIndexByGoodsDisplaySpace?: Map<number, GoodsCubeState>
  private __townMakerStatesIndexByTrackTile?: Map<number, TownMarkerState>

  @Type(() => User)
  public readonly users: User[]

  @Type(() => Player)
  public readonly players: Player[]

  @Type(() => TrackTileState)
  public readonly trackTileStates: TrackTileState[]

  @Type(() => CityTileState)
  public readonly cityTileStates: CityTileState[]

  @Type(() => GoodsCubeState)
  public readonly goodsCubeStates: GoodsCubeState[]

  @Type(() => TownMarkerState)
  public readonly townMakerStates: TownMarkerState[]

  constructor (
    users: User[],
    public readonly round: number,
    public readonly phase: Phase,
    players: Player[],
    public readonly turnPlayerId: number,
    trackTileStates: TrackTileState[],
    cityTileStates: CityTileState[],
    goodsCubeStates: GoodsCubeState[],
    townMakerStates: TownMarkerState[],
    public readonly histories: Array<{ id: string, fixed: boolean }>
  ) {
    super()

    this.users = users
    this.players = players
    this.trackTileStates = trackTileStates
    this.cityTileStates = cityTileStates
    this.goodsCubeStates = goodsCubeStates
    this.townMakerStates = townMakerStates
  }

  get trackTileStatesIndexByMapSpace (): Map<number, TrackTileState> {
    // eslint-disable-next-line no-return-assign
    return this.__trackTileStatesIndexByMapSpace ??= createUniqueIndex(this.trackTileStates, 'mapSpaceId')
  }

  get cityTileStatesIndexByMapSpace (): Map<number, CityTileState> {
    // eslint-disable-next-line no-return-assign
    return this.__cityTileStatesIndexByMapSpace ??= createUniqueIndex(this.cityTileStates, 'mapSpaceId')
  }

  get goodsCubeStatesIndexByMapSpace (): Map<number, GoodsCubeState[]> {
    // eslint-disable-next-line no-return-assign
    return this.__goodsCubeStatesIndexByMapSpace ??= createIndex(this.goodsCubeStates, 'mapSpaceId')
  }

  get goodsCubeStatesIndexByGoodsDisplaySpace (): Map<number, GoodsCubeState> {
    // eslint-disable-next-line no-return-assign
    return this.__goodsCubeStatesIndexByGoodsDisplaySpace ??= createUniqueIndex(this.goodsCubeStates, 'goodsDisplaySpaceId')
  }

  get townMakerStatesIndexByTrackTile (): Map<number, TownMarkerState> {
    // eslint-disable-next-line no-return-assign
    return this.__townMakerStatesIndexByTrackTile ??= createUniqueIndex(this.townMakerStates, 'trackTileId')
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

  public flesh (): Game {
    this.__trackTileStatesIndexByMapSpace = undefined
    this.__cityTileStatesIndexByMapSpace = undefined
    this.__goodsCubeStatesIndexByMapSpace = undefined
    this.__goodsCubeStatesIndexByGoodsDisplaySpace = undefined
    this.__townMakerStatesIndexByTrackTile = undefined

    return this
  }
}
