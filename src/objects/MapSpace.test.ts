import { MapSpaceType, CityTileColor } from 'enums'
import { type Game, GameBuilder, Player, User, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, getMapSpace, Line, TrackTile, townMarkers, TownMarker, Town } from 'objects'
import { PlayerColor } from '../enums/PlayerColor'

function forceReplaceArray<T> (target: readonly T[], replace: T[]): T[] {
  return (target as T[]).splice(0, target.length, ...replace)
}

function t (replaceMapSpaces: Array<MapSpace | null>, replaceCityTiles: CityTile [], callback: () => void): void {
  const srcMapSpace = forceReplaceArray(mapSpaces, replaceMapSpaces)
  const srcCityTiles = forceReplaceArray(cityTiles, replaceCityTiles)
  try {
    callback()
  } finally {
    forceReplaceArray(mapSpaces, srcMapSpace)
    forceReplaceArray(cityTiles, srcCityTiles)
  }
}

let g: Game
let b: GameBuilder

const s = (col: number, row: number): number => col * 3 + row

const mapC3R3: [MapSpace[], CityTile[]] = [
  [
    // 1 列目
    new MapSpace(s(0, 0), MapSpaceType.CITY, '', 0, 0, [null, null, s(1, 0), s(0, 1), null, null]),
    new MapSpace(s(0, 1), MapSpaceType.PLAIN, '', 0, 0, [s(0, 0), s(1, 0), s(1, 1), s(0, 2), null, null]),
    new MapSpace(s(0, 2), MapSpaceType.PLAIN, '', 0, 0, [s(0, 1), s(1, 1), s(1, 2), null, null, null]),
    // 2 列目
    new MapSpace(s(1, 0), MapSpaceType.PLAIN, '', 0, 0, [null, s(2, 0), s(2, 1), s(1, 1), s(0, 1), s(0, 0)]),
    new MapSpace(s(1, 1), MapSpaceType.TOWN, '', 0, 0, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
    new MapSpace(s(1, 2), MapSpaceType.PLAIN, '', 0, 0, [s(1, 1), s(2, 2), null, null, null, s(0, 2)]),
    // 3 列目
    new MapSpace(s(2, 0), MapSpaceType.PLAIN, '', 0, 0, [null, null, null, s(2, 1), s(1, 0), null]),
    new MapSpace(s(2, 1), MapSpaceType.PLAIN, '', 0, 0, [s(2, 0), null, null, s(2, 2), s(1, 1), s(1, 0)]),
    new MapSpace(s(2, 2), MapSpaceType.CITY, '', 0, 0, [s(2, 1), null, null, null, s(1, 2), s(1, 1)])
  ],
  [
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 }),
    new CityTile(1, '', CityTileColor.RED, { mapSpaceId: s(2, 2), goodsCubesQuantity: 2 })
  ]
]

test('getLinkedObject CityTileに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 1))

      const linkedObject = mapSpace.getLinkedObject(0) as CityTile

      expect(linkedObject).toBeInstanceOf(CityTile)
      expect(linkedObject.id).toBe(0)
    }
  )
})

test('getLinkedObject MapSpaceに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 1))

      const linkedObject = mapSpace.getLinkedObject(2) as MapSpace

      expect(linkedObject).toBeInstanceOf(MapSpace)
      expect(linkedObject.id).toBe(s(1, 1))
    }
  )
})

test('getLinkedObject Lineに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 2))

      const linkedObject = mapSpace.getLinkedObject(0) as Line

      expect(linkedObject).toBeInstanceOf(Line)
      expect(linkedObject.trackTileId).toBe(0)
      expect(linkedObject.number).toBe(1)
    }
  )
})

test('getLinkedObject TrackTileに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 2))

      const linkedObject = mapSpace.getLinkedObject(0) as CityTile

      expect(linkedObject).toBeInstanceOf(TrackTile)
      expect(linkedObject.id).toBe(52)
    }
  )
})

test('getLinkedObject マップ外', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 0))

      const linkedObject = mapSpace.getLinkedObject(0) as CityTile

      expect(linkedObject).toBeNull()
    }
  )
})

test('getLinkedTerminalObject CityTileに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 1))

      const linkedObject = mapSpace.getLinkedTerminalObject(0) as CityTile

      expect(linkedObject).toBeInstanceOf(CityTile)
      expect(linkedObject.id).toBe(0)
    }
  )
})

test('getLinkedTerminalObject MapSpaceに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 1))

      const linkedObject = mapSpace.getLinkedTerminalObject(2) as MapSpace

      expect(linkedObject).toBeInstanceOf(MapSpace)
      expect(linkedObject.id).toBe(s(1, 1))
    }
  )
})

test('getLinkedTerminalObject TrackTileに接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 2))

      const linkedObject = mapSpace.getLinkedTerminalObject(0) as CityTile

      expect(linkedObject).toBeInstanceOf(TrackTile)
      expect(linkedObject.id).toBe(52)
    }
  )
})

test('getLinkedTerminalObject マップ外', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 0))

      const linkedObject = mapSpace.getLinkedTerminalObject(0) as CityTile

      expect(linkedObject).toBeNull()
    }
  )
})

test('getLinkedTerminalObject Lineを経由して都市に接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(0, 2))

      const linkedObject = mapSpace.getLinkedTerminalObject(0) as CityTile

      expect(linkedObject).toBeInstanceOf(CityTile)
      expect(linkedObject.id).toBe(0)
    }
  )
})

test('getLinkedTerminalObject 複数Lineを経由して都市に接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 2)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(1, 2))

      const linkedObject = mapSpace.getLinkedTerminalObject(5) as CityTile

      expect(linkedObject).toBeInstanceOf(CityTile)
      expect(linkedObject.id).toBe(0)
    }
  )
})

test('getLinkedTerminalObject 複数Lineを経由して町（TownMarker）に接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 1)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[53])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(0, 2)), 4)
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(2, 2))

      const linkedObject = mapSpace.getLinkedTerminalObject(4) as TownMarker

      expect(linkedObject).toBeInstanceOf(TownMarker)
      expect(linkedObject.id).toBe(0)
    }
  )
})

test('getLinkedTerminalObject 複数Lineを経由して町（Town）に接続', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[144], getMapSpace(s(1, 1)), 1)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[144])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(0, 2)), 4)
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const mapSpace = getMapSpace(s(2, 2))

      const linkedObject = mapSpace.getLinkedTerminalObject(4) as Town

      expect(linkedObject).toBeInstanceOf(Town)
      expect(linkedObject.trackTile.id).toBe(144)
    }
  )
})
