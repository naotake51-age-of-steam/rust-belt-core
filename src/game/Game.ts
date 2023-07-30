import { type Player, type GoodsCubeState, type TrackTileState, type CityTileState, type TownMarkerState, type Phase, type User } from 'game'
import { type MapSpace, type TrackTile, type CityTile, type GoodsCube, type TownMarker } from 'objects'

export class Game {
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
    throw new Error('Not implemented')
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
}
