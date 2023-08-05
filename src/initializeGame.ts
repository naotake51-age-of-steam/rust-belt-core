import { Game, type User, WaitingStartPhase, TrackTileState, CityTileState, GoodsCubeState, TownMarkerState } from 'game'
import { cityTiles, goodsCubes, townMarkers, trackTiles } from 'objects'

export const initializeGame = (id: string, adminUser: User): Game => {
  return new Game(
    id,
    adminUser,
    [],
    1,
    new WaitingStartPhase([]),
    [],
    0,
    trackTiles.map(_ => new TrackTileState(_.id, null, null, null)),
    cityTiles.map(_ => new CityTileState(_.id, _.initialize?.mapSpaceId ?? null)),
    goodsCubes.map(_ => new GoodsCubeState(_.id, null, null)),
    townMarkers.map(_ => new TownMarkerState(_.id, null)),
    []
  )
}
