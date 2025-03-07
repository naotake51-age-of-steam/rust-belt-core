import { MapSpaceType, CityTileColor } from 'enums'
import { type Game, GameBuilder, Player, User, setContext } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, getMapSpace } from 'objects'
import { PlayerColor } from '../../enums/PlayerColor'
import { ComplexCoexistTrackTile } from './ComplexCoexistTrackTile'

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

const s = (col: number, row: number): number => col * 4 + row

const mapC4R4: [MapSpace[], CityTile[]] = [
  [
    // 1 列目
    new MapSpace(s(0, 0), MapSpaceType.CITY, '', 0, 0, [null, null, s(1, 0), s(0, 1), null, null]),
    new MapSpace(s(0, 1), MapSpaceType.PLAIN, '', 0, 0, [s(0, 0), s(1, 0), s(1, 1), s(0, 2), null, null]),
    new MapSpace(s(0, 2), MapSpaceType.PLAIN, '', 0, 0, [s(0, 1), s(1, 1), s(1, 2), s(0, 3), null, null]),
    new MapSpace(s(0, 3), MapSpaceType.PLAIN, '', 0, 0, [s(0, 2), s(1, 2), s(1, 3), null, null, null]),
    // 2 列目
    new MapSpace(s(1, 0), MapSpaceType.PLAIN, '', 0, 0, [null, s(2, 0), s(2, 1), s(1, 1), s(0, 1), s(0, 0)]),
    new MapSpace(s(1, 1), MapSpaceType.PLAIN, '', 0, 0, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
    new MapSpace(s(1, 2), MapSpaceType.PLAIN, '', 0, 0, [s(1, 1), s(2, 2), s(2, 3), s(1, 3), s(0, 3), s(0, 2)]),
    new MapSpace(s(1, 3), MapSpaceType.PLAIN, '', 0, 0, [s(1, 2), s(2, 3), null, null, null, s(0, 3)]),
    // 3 列目
    new MapSpace(s(2, 0), MapSpaceType.PLAIN, '', 0, 0, [null, null, s(3, 0), s(2, 1), s(1, 0), null]),
    new MapSpace(s(2, 1), MapSpaceType.PLAIN, '', 0, 0, [s(2, 0), s(3, 0), s(3, 1), s(2, 2), s(1, 1), s(1, 0)]),
    new MapSpace(s(2, 2), MapSpaceType.TOWN, '', 0, 0, [s(2, 1), s(3, 1), s(3, 2), s(2, 3), s(1, 2), s(1, 1)]),
    new MapSpace(s(2, 3), MapSpaceType.PLAIN, '', 0, 0, [s(2, 2), s(3, 2), s(3, 3), null, s(1, 3), s(1, 2)]),
    // 4 列目
    new MapSpace(s(3, 0), MapSpaceType.PLAIN, '', 0, 0, [null, null, null, s(3, 1), s(2, 1), s(2, 0)]),
    new MapSpace(s(3, 1), MapSpaceType.PLAIN, '', 0, 0, [s(3, 0), null, null, s(3, 2), s(2, 2), s(2, 1)]),
    new MapSpace(s(3, 2), MapSpaceType.PLAIN, '', 0, 0, [s(3, 1), null, null, s(3, 3), s(2, 3), s(2, 2)]),
    new MapSpace(s(3, 3), MapSpaceType.CITY, '', 0, 0, [s(3, 2), null, null, null, null, s(2, 3)])
  ],
  [
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 }),
    new CityTile(1, '', CityTileColor.RED, { mapSpaceId: s(3, 3), goodsCubesQuantity: 2 })
  ]
]

test('canPlaceToMapSpace 都市から線路を延ばせる', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const trackTile = trackTiles[119]

      expect(trackTile).toBeInstanceOf(ComplexCoexistTrackTile)

      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 3)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(1, 3)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 1)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(2, 3)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(3, 0)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(3, 1)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(3, 2)), 0)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(3, 3)), 0)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace タイル向きごとの都市接続判定', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      const trackTile = trackTiles[119]

      expect(trackTile).toBeInstanceOf(ComplexCoexistTrackTile)

      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(true)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 1)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 2)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 3)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 4)).toBe(false)
      expect(trackTile.canPlaceToMapSpace(getMapSpace(s(0, 1)), 5)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 線路への接続判定', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(0, 2)), 0)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace マップ外へ出てしまう場合はFalse', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[123].canPlaceToMapSpace(getMapSpace(s(0, 1)), 1)).toBe(false) // マップの外につながる
    }
  )
})

test('canPlaceToMapSpace 都市から出て町へ線路を敷くケース', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(2, 2)), 3)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace 都市から出て町へ線路を敷くケース（2本接続）', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        // 1 本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        // 2 本目
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(1, 0)), 2)
        .placeTrackTileToMapSpace(trackTiles[55], getMapSpace(s(2, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(2, 2)), 3)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace 都市から出て町へ線路を敷くケース（2本接続、間にComplexCoexistTrackTileを挟む）', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(1, 1)), 5)
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(2, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[120].canPlaceToMapSpace(getMapSpace(s(2, 2)), 3)).toBe(true)
    }
  )
})

test('canPlaceToMapSpace 都市から出て町へ線路を敷くケース（2本接続、間にComplexCoexistTrackTileを挟む、その内片方が他人の線路）', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(1, 1)), 5)
        .setLineOwner(trackTiles[119].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[119].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(2, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[120].canPlaceToMapSpace(getMapSpace(s(2, 2)), 3)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace いきなり町へ線路を敷くことはできない', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(2, 2)), 5)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace すでにタイルが置かれている場合はFalse', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(1, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[123].canPlaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 未接続となる線路がある場合', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
    }
  )
})

test('canPlaceToMapSpace 他人の線路につながる場合はFalse', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .setLineOwner(trackTiles[111].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .setLineOwner(trackTiles[111].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', '鈴木二郎', PlayerColor.BLUE, null, 3, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canPlaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 方向転換', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(1, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[123].canReplaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 先端でない線路は方向転換できない', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(1, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 2)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[123].canReplaceToMapSpace(getMapSpace(s(1, 1)), 0)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace フォローできない線路がある場合は置き換え不可', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canReplaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 同じタイルタイプ、線路の方向が同じ場合は置き換え不可', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(1, 0)), 1)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].canReplaceToMapSpace(getMapSpace(s(0, 1)), 0)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 町ヘクスに敷かれているタイルは方向転換不可', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(1, 0)), 2)
        .placeTrackTileToMapSpace(trackTiles[55], getMapSpace(s(2, 1)), 0)
        .placeTrackTileToMapSpace(trackTiles[119], getMapSpace(s(2, 2)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[121].canReplaceToMapSpace(getMapSpace(s(2, 2)), 3)).toBe(false)
    }
  )
})

test('canReplaceToMapSpace 町へ敷かれている線路の置き換え、フォローできている場合はTrue', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(2, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[121].canReplaceToMapSpace(getMapSpace(s(2, 2)), 0)).toBe(true)
    }
  )
})

test('canReplaceToMapSpace 町へ敷かれている線路の置き換え、フォローでない場合はFalse', () => {
  t(
    ...mapC4R4,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', '山田太郎', PlayerColor.RED, null, 1, 2, 10, 0, 1)
        ])
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(2, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[121].canReplaceToMapSpace(getMapSpace(s(2, 2)), 2)).toBe(false)
    }
  )
})
