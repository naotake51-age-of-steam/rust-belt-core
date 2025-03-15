import { Game, WaitingStartPhase, TrackTileState, CityTileState, GoodsCubeState, TownMarkerState } from 'game'
import { cityTiles, goodsCubes, townMarkers, trackTiles } from 'objects'

export const initializeGame = (): Game => {
  return new Game(
    [],
    1,
    new WaitingStartPhase([]),
    null,
    trackTiles.map(_ => new TrackTileState(_.id, null, null, null)),
    cityTiles.map(_ => new CityTileState(_.id, _.initialize?.mapSpaceId ?? null)),
    goodsCubes.map(_ => new GoodsCubeState(_.id, null, null)),
    townMarkers.map(_ => new TownMarkerState(_.id, null))
  )
}
