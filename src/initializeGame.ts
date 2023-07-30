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
    trackTiles.map(_ => new TrackTileState(null, null, null)),
    cityTiles.map(_ => new CityTileState((_.initialize !== null) ? _.initialize.mapSpaceId : null)),
    goodsCubes.map(_ => new GoodsCubeState(null, null)),
    townMarkers.map(_ => new TownMarkerState(null)),
    []
  )
}
