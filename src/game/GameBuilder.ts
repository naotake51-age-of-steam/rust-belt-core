import { type Phase, type Game, type Player, type User, TrackTileState, GoodsCubeState, CityTileState, TownMarkerState } from 'game'
import { type MapSpace, type GoodsCube, type Line, type TrackTile, type GoodsDisplaySpace, type CityTile, type TownMarker } from 'objects'

type Writable<T> = { -readonly [P in keyof T]: T[P] }

export class GameBuilder {
  private readonly game: Writable<Game>

  constructor (
    original: Game
  ) {
    this.game = original // TODO: deep copy
  }

  public setTurnPlayer (player: Player): GameBuilder {
    this.game.turnPlayerId = player.id

    return this
  }

  public setRound (round: number): GameBuilder {
    this.game.round = round

    return this
  }

  public setPhase (phase: Phase): GameBuilder {
    this.game.phase = phase

    return this
  }

  public setUsers (users: User[]): GameBuilder {
    this.game.users = users

    return this
  }

  public setPlayers (players: Player[]): GameBuilder {
    this.game.players = players

    return this
  }

  public updatePlayer (player: Player): GameBuilder {
    this.game.players = this.game.players.map(_ => _.id === player.id ? player : _)

    return this
  }

  public placeTrackTileToMapSpace (trackTile: TrackTile, mapSpace: MapSpace, rotation: number): GameBuilder {
    this.game.trackTileStates[trackTile.id] = new TrackTileState(mapSpace.id, rotation, trackTile.lines.map(_ => null))

    return this
  }

  public releaseTrackTile (trackTile: TrackTile): GameBuilder {
    this.game.trackTileStates[trackTile.id] = new TrackTileState(null, null, null)

    return this
  }

  public placeGoodsCubeToMapSpace (goodsCube: GoodsCube, mapSpace: MapSpace): GameBuilder {
    this.game.goodsCubeStates[goodsCube.id] = new GoodsCubeState(mapSpace.id, null)

    return this
  }

  public placeGoodsCubeToGoodsDisplaySpace (goodsCube: GoodsCube, goodsDisplaySpace: GoodsDisplaySpace): GameBuilder {
    this.game.goodsCubeStates[goodsCube.id] = new GoodsCubeState(null, goodsDisplaySpace.id)

    return this
  }

  public releaseGoodsCube (goodsCube: GoodsCube): GameBuilder {
    this.game.goodsCubeStates[goodsCube.id] = new GoodsCubeState(null, null)

    return this
  }

  public placeCityTileToMapSpace (cityTile: CityTile, mapSpace: MapSpace): GameBuilder {
    this.game.cityTileStates[cityTile.id] = new CityTileState(mapSpace.id)

    return this
  }

  public placeTownMarkerToTrackTile (townMaker: TownMarker, trackTile: TrackTile): GameBuilder {
    this.game.townMakerStates[townMaker.id] = new TownMarkerState(trackTile.id)

    return this
  }

  public releaseTownMarkerToTrackTile (townMaker: TownMarker): GameBuilder {
    this.game.townMakerStates[townMaker.id] = new TownMarkerState(null)

    return this
  }

  public setLineOwner (line: Line, owner: Player | null): GameBuilder {
    const trackTileState = this.game.trackTileStates[line.trackTileId]

    if (trackTileState.lineOwners === null) {
      throw new Error('track tile is not placed')
    }

    trackTileState.lineOwners[line.number] = owner?.id ?? null

    return this
  }

  public pushHistory (id: string, fixed: boolean): GameBuilder {
    this.game.histories.push({ id, fixed })

    return this
  }

  public build (): Game {
    return this.game // TODO: deep copy
  }
}
