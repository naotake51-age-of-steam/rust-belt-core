import { MapSpaceType } from 'enums'
import { GoodsCubeState, TownMarkerState, TrackTileState, WaitingStartPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { cityTiles, goodsCubes, trackTiles } from 'objects'
import { range } from 'utility'
import { townMarkers } from './objects/index'

test('initializeGame', () => {
  const g = initializeGame('00000000-0000-0000-0000-000000000000', { id: '00000000-0000-0000-0000-000000000001', name: '山田太郎' })

  expect(g.id).toBe('00000000-0000-0000-0000-000000000000')

  expect(g.adminUser).toEqual({ id: '00000000-0000-0000-0000-000000000001', name: '山田太郎' })

  expect(g.users).toEqual([])

  expect(g.round).toBe(1)

  expect(g.phase).toEqual(new WaitingStartPhase([]))

  expect(g.players).toEqual([])

  expect(g.turnPlayerId).toBe(0)

  expect(g.trackTileStates.length).toBe(trackTiles.length)
  expect(g.trackTileStates[0]).toEqual(new TrackTileState(null, null, null))

  expect(g.cityTileStates.length).toBe(cityTiles.length)
  range(0, 11).forEach(i => {
    expect(g.cityTileStates[i].mapSpaceId).not.toBeNull()
    expect(g.cityTileStates[i].mapSpace?.type).toBe(MapSpaceType.CITY)
  })
  range(12, 19).forEach(i => {
    expect(g.cityTileStates[i].mapSpaceId).toBeNull()
    expect(g.cityTileStates[i].mapSpace).toBeNull()
  })

  expect(g.goodsCubeStates.length).toBe(goodsCubes.length)
  expect(g.goodsCubeStates[0]).toEqual(new GoodsCubeState(null, null))

  expect(g.townMakerStates.length).toBe(townMarkers.length)
  expect(g.townMakerStates[0]).toEqual(new TownMarkerState(null))

  expect(g.histories).toEqual([])
})
