import { MapSpaceType, CityTileColor } from 'enums'
import { type Game, GameBuilder, Player, User, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, getMapSpace, townMarkers } from 'objects'
import { TownTrackTile } from './TownTrackTile'

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

const mapC2R3: [MapSpace[], CityTile[]] = [
  [
    // 1 列目
    new MapSpace(s(0, 0), MapSpaceType.CITY, '', 0, 0, [null, null, s(1, 0), s(0, 1), null, null]),
    new MapSpace(s(0, 1), MapSpaceType.PLAIN, '', 0, 0, [s(0, 0), s(1, 0), s(1, 1), s(0, 2), null, null]),
    new MapSpace(s(0, 2), MapSpaceType.PLAIN, '', 0, 0, [s(0, 1), s(1, 1), s(1, 2), null, null, null]),
    // 2 列目
    new MapSpace(s(1, 0), MapSpaceType.PLAIN, '', 0, 0, [null, null, null, s(1, 1), s(0, 1), s(0, 0)]),
    new MapSpace(s(1, 1), MapSpaceType.TOWN, '', 0, 0, [s(1, 0), null, null, s(1, 2), s(0, 2), s(0, 1)]),
    new MapSpace(s(1, 2), MapSpaceType.PLAIN, '', 0, 0, [s(1, 1), null, null, null, null, s(0, 2)])
  ],
  [
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 })
  ]
]

test('canPlaceToMapSpace 都市からつながっている町スペースに町タイルを置ける、ただし線路が繋がらない場合は置けない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const trackTile = trackTiles[141]

      expect(trackTile).toBeInstanceOf(TownTrackTile)

      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false) // 線路がつながならのでFalse
    }
  )
})

test('canPlaceToMapSpace 町スペース以外に町タイルをおけない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canPlaceToMapSpace(getMapSpace(s(0, 2)), 0)).toBe(false)
      expect(trackTiles[141].canPlaceToMapSpace(getMapSpace(s(1, 0)), 2)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace マップ外へ出てしまう場合はFalse', () => {
  t(
    ...mapC2R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(false) // マップの外につながる
    }
  )
})

test('canPlaceToMapSpace すでにタイルが置かれている場合はFalse', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[144], getMapSpace(s(1, 1)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 他人の線路につながる場合はFalse', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .setLineOwner(trackTiles[53].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canPlaceToMapSpace(getMapSpace(s(1, 1)), 5)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace フォローできない線路がある場合は置き換え不可', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[141], getMapSpace(s(1, 1)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[153].canReplaceToMapSpace(getMapSpace(s(1, 1)), 5)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace フォローできない線路がある場合は置き換え不可（通常線路の置き換え）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[153].canReplaceToMapSpace(getMapSpace(s(1, 1)), 5)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace すべての線路をフォローできる場合は置き換え可', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[153], getMapSpace(s(1, 1)), 5)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canReplaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace すべての線路をフォローできる場合は置き換え可（通常線路の置き換え）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141].canReplaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 同じタイルタイプ、線路の方向が同じ場合は置き換え不可', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[153], getMapSpace(s(1, 1)), 5)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[153].canReplaceToMapSpace(getMapSpace(s(1, 1)), 5)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 町ヘクスの置き換えによって、循環するリンクができあがる場合はFalse', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[111])
        .placeTrackTileToMapSpace(trackTiles[112], getMapSpace(s(1, 0)), 5)
        .placeTrackTileToMapSpace(trackTiles[113], getMapSpace(s(2, 1)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[147].canReplaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false)
      expect(trackTiles[141].canReplaceToMapSpace(getMapSpace(s(1, 1)), 5)).toBe(true) // 循環しなければOK
    }
  )
})
