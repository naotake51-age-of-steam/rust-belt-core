import { type Phase, type Game, type Player, type User } from 'game'
import { type MapSpace, type GoodsCube, type Line, type TrackTile, type GoodsDisplaySpace, type CityTile, type TownMarker } from 'objects'

type Writable<T> = { -readonly [P in keyof T]: T[P] }

export class GameBuilder {
  private readonly game: Writable<Game>

  constructor (
    public readonly original: Game
  ) {
    this.game = original // TODO: deep copy
  }

  public setTurnPlayer (player: Player): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public setRound (round: number): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public setPhase (phase: Phase): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public setUsers (users: User[]): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public setPlayers (players: Player[]): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public placeTrackTileToMapSpace (trackTile: TrackTile, mapSpace: MapSpace, rotation: number): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public releaseTrackTile (trackTile: TrackTile): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public placeGoodsCubeToMapSpace (goodsCube: GoodsCube, mapSpace: MapSpace): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public placeGoodsCubeToGoodsDisplaySpace (goodsCube: GoodsCube, goodsDisplaySpace: GoodsDisplaySpace): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public releaseGoodsCube (goodsCube: GoodsCube): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public placeCityTileToMapSpace (cityTile: CityTile, mapSpace: MapSpace): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public placeTownMarkerToTrackTile (townMaker: TownMarker, trackTile: TrackTile): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public releaseTownMarkerToTrackTile (townMaker: TownMarker): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public setLineOwner (line: Line, owner: Player | null): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public pushHistory (id: string, fixed: boolean): GameBuilder {
    // TODO: Not implemented
    return this
  }

  public build (): Game {
    return this.game // TODO: deep copy
  }
}
