import { MapSpaceType, CityTileColor } from 'enums'
import { type Game, GameBuilder, Player, User, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, SimpleTrackTile, getMapSpace, townMarkers } from 'objects'

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

// eslint-disable-next-line @typescript-eslint/naming-convention
const mapC3R3_2: [MapSpace[], CityTile[]] = [
  [
    // 1 列目
    new MapSpace(s(0, 0), MapSpaceType.CITY, '', 0, 0, [null, null, s(1, 0), s(0, 1), null, null]),
    new MapSpace(s(0, 1), MapSpaceType.PLAIN, '', 0, 0, [s(0, 0), s(1, 0), s(1, 1), s(0, 2), null, null]),
    new MapSpace(s(0, 2), MapSpaceType.PLAIN, '', 0, 0, [s(0, 1), s(1, 1), s(1, 2), null, null, null]),
    // 2 列目
    new MapSpace(s(1, 0), MapSpaceType.PLAIN, '', 0, 0, [null, s(2, 0), s(2, 1), s(1, 1), s(0, 1), s(0, 0)]),
    new MapSpace(s(1, 1), MapSpaceType.PLAIN, '', 0, 0, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
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

test('canPlaceToMapSpace 都市から線路を延ばせる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const trackTile = trackTiles[0]

      expect(trackTile).toBeInstanceOf(SimpleTrackTile)

      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 1)), 0)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 2)), 0)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace タイル向きごとの都市接続判定', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const trackTile = trackTiles[0]

      expect(trackTile).toBeInstanceOf(SimpleTrackTile)

      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 1)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 2)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 3)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 4)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 5)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 線路への接続判定', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].canPlaceToMapSpace(getMapSpace(s(0, 2)), 3)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace マップ外へ出てしまう場合はFalse', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].canPlaceToMapSpace(getMapSpace(s(0, 2)), 0)).toBe(false) // マップの外につながる
    }
  )
})

test('canPlaceToMapSpace 都市から出て町へ線路を敷くケース', () => {
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

      expect(trackTiles[53].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace いきなり町へ線路を敷くことはできない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(false)
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
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 他線路と都市に同時につながる場合', () => {
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
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 2)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53].canPlaceToMapSpace(getMapSpace(s(1, 2)), 2)).toBe(true)
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
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .setLineOwner(trackTiles[1].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[1].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 2)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', '#000001', null, 3, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53]).toBeInstanceOf(SimpleTrackTile)
      expect(trackTiles[53].canPlaceToMapSpace(getMapSpace(s(1, 2)), 2)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 町に配置して自身の町に戻らない場合はTrue', () => {
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
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[111].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace 町以外に配置して同じ町、都市に戻らない場合はTrue', () => {
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
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53].canPlaceToMapSpace(getMapSpace(s(1, 0)), 0)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace 循環するリンクができあがる場合はFalse', () => {
  t(
    ...mapC3R3_2,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[111].canPlaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 方向転換', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].canReplaceToMapSpace(getMapSpace(s(0, 1)), 3)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 都市から2本目の線路を方向転換', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 2)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[111].canReplaceToMapSpace(getMapSpace(s(0, 2)), 3)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 先端でない線路は方向転換できない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 2)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53].canReplaceToMapSpace(getMapSpace(s(0, 1)), 3)).toBe(false)
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
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].canReplaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
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
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[1].canReplaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
      expect(trackTiles[1].canReplaceToMapSpace(getMapSpace(s(0, 1)), 3)).toBe(false) // 向きが異なるが反転して同じ線路になるのでNG
    }
  )
})

test('canReplaceToMapSpace 町ヘクスに敷かれているタイルは方向転換不可', () => {
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
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[111].canReplaceToMapSpace(getMapSpace(s(1, 1)), 2)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 町へ敷かれている線路の置き換え、フォローでない場合はFalse', () => {
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
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].canReplaceToMapSpace(getMapSpace(s(1, 1)), 1)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 町ヘクスの置き換えによって、循環するリンクができあがる場合はFalse', () => {
  t(
    ...mapC3R3_2,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', '#000000', null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 1)
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(0, 2)), 3)
        .placeTrackTileToMapSpace(trackTiles[112], getMapSpace(s(0, 1)), 5)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canReplaceToMapSpace(getMapSpace(s(1, 1)), 3)).toBe(false)
    }
  )
})
