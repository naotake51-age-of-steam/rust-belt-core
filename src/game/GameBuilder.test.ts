import { type Game, GameBuilder, Player, EndGamePhase, User } from 'game'
import { initializeGame } from 'initializeGame'
import { trackTiles, getMapSpace, goodsDisplaySpaces, cityTiles, townMarkers } from 'objects'
import { goodsCubes } from '../objects/index'

let g: Game
let b: GameBuilder

beforeEach(() => {
  g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
  b = new GameBuilder(g)
})

test('setTurnPlayer', () => {
  const player = new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 4, 20, 0, 1)

  b.setTurnPlayer(player)

  const newGame = b.build()

  expect(newGame.turnPlayerId).toBe(player.id)
})

test('setRound', () => {
  const round = 2

  b.setRound(round)

  const newGame = b.build()

  expect(newGame.round).toBe(round)
})

test('setPhase', () => {
  const phase = new EndGamePhase([])

  b.setPhase(phase)

  const newGame = b.build()

  expect(newGame.phase).toEqual(phase)
})

test('setUsers', () => {
  const users = [new User('00000000-0000-0000-0000-000000000001', '山田太郎'), new User('00000000-0000-0000-0000-000000000002', '山田花子')]

  b.setUsers(users)

  const newGame = b.build()

  expect(newGame.users).toEqual(users)
})

test('setPlayers', () => {
  const players = [
    new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 4, 20, 0, 1),
    new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 3, 15, 0, 1)
  ]

  b.setPlayers(players)

  const newGame = b.build()

  expect(newGame.players).toEqual(players)
})

test('placeTrackTileToMapSpace', () => {
  const trackTile = trackTiles[0]

  const mapSpace = getMapSpace(0)

  b.placeTrackTileToMapSpace(trackTile, mapSpace, 4)

  const newGame = b.build()

  expect(newGame.trackTileStates[0].mapSpaceId).toBe(0)
  expect(newGame.trackTileStates[0].rotation).toBe(4)
  expect(newGame.trackTileStates[0].lineOwners).toEqual([null, null])
})

test('releaseTrackTile', () => {
  const trackTile = trackTiles[0]

  const mapSpace = getMapSpace(0)

  b.placeTrackTileToMapSpace(trackTile, mapSpace, 4)

  b.releaseTrackTile(trackTile)

  const newGame = b.build()

  expect(newGame.trackTileStates[0].mapSpaceId).toBeNull()
  expect(newGame.trackTileStates[0].rotation).toBeNull()
  expect(newGame.trackTileStates[0].lineOwners).toBeNull()
})

test('placeGoodsCubeToMapSpace', () => {
  const goodsCube = goodsCubes[0]

  const mapSpace = getMapSpace(0)

  b.placeGoodsCubeToMapSpace(goodsCube, mapSpace)

  const newGame = b.build()

  expect(newGame.goodsCubeStates[0].mapSpaceId).toBe(0)
  expect(newGame.goodsCubeStates[0].goodsDisplaySpaceId).toBeNull()
})

test('placeGoodsCubeToGoodsDisplaySpace', () => {
  const goodsCube = goodsCubes[0]

  const goodsDisplaySpace = goodsDisplaySpaces[0]

  b.placeGoodsCubeToGoodsDisplaySpace(goodsCube, goodsDisplaySpace)

  const newGame = b.build()

  expect(newGame.goodsCubeStates[0].mapSpaceId).toBeNull()
  expect(newGame.goodsCubeStates[0].goodsDisplaySpaceId).toBe(0)
})

test('releaseGoodsCube', () => {
  const goodsCube = goodsCubes[0]

  const goodsDisplaySpace = goodsDisplaySpaces[0]

  b.placeGoodsCubeToGoodsDisplaySpace(goodsCube, goodsDisplaySpace)

  b.releaseGoodsCube(goodsCube)

  const newGame = b.build()

  expect(newGame.goodsCubeStates[0].mapSpaceId).toBeNull()
  expect(newGame.goodsCubeStates[0].goodsDisplaySpaceId).toBeNull()
})

test('placeCityTileToMapSpace', () => {
  const cityTile = cityTiles[0]

  const mapSpace = getMapSpace(0)

  b.placeCityTileToMapSpace(cityTile, mapSpace)

  const newGame = b.build()

  expect(newGame.cityTileStates[0].mapSpaceId).toEqual(0)
})

test('placeTownMarkerToTrackTile', () => {
  const townMarker = townMarkers[0]

  const trackTile = trackTiles[0]

  b.placeTownMarkerToTrackTile(townMarker, trackTile)

  const newGame = b.build()

  expect(newGame.townMakerStates[0].trackTileId).toBe(0)
})

test('releaseTownMarkerToTrackTile', () => {
  const townMarker = townMarkers[0]

  const trackTile = trackTiles[0]

  b.placeTownMarkerToTrackTile(townMarker, trackTile)

  b.releaseTownMarkerToTrackTile(townMarker)

  const newGame = b.build()

  expect(newGame.townMakerStates[0].trackTileId).toBeNull()
})

test('setLineOwner', () => {
  const trackTile = trackTiles[0]
  const line = trackTile.lines[0]
  const mapSpace = getMapSpace(0)

  const player = new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 4, 20, 0, 1)

  b.placeTrackTileToMapSpace(trackTile, mapSpace, 4) // 先にタイルが配置されている必要がある
  b.setLineOwner(line, player)

  const newGame = b.build()

  expect(newGame.trackTileStates[0].lineOwners).toEqual([0, null])
})

test('pushHistory', () => {
  b.pushHistory('00000000-0000-0000-0000-000000000000', true)

  const newGame = b.build()

  expect(newGame.histories).toEqual([
    { id: '00000000-0000-0000-0000-000000000000', fixed: true }
  ])
})
