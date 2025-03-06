import { MapSpaceType, CityTileColor, Action } from 'enums'
import { type Game, GameBuilder, Player, User, setContext, BuildTrackPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, getMapSpace, TownMarker, SimpleTrackTile, Town, TownTrackTile, townMarkers } from 'objects'
import { ComplexCoexistTrackTile } from '../../objects/TrackTile/ComplexCoexistTrackTile'
import { ComplexCrossingTrackTile } from '../../objects/TrackTile/ComplexCrossingTrackTile'

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
    new CityTile(1, '', CityTileColor.RED, { mapSpaceId: s(2, 2), goodsCubesQuantity: 2 }),
    new CityTile(2, '', CityTileColor.RED)
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
    new MapSpace(s(1, 1), MapSpaceType.TOWN, '', 0, 0, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
    new MapSpace(s(1, 2), MapSpaceType.PLAIN, '', 0, 0, [s(1, 1), s(2, 2), null, null, null, s(0, 2)]),
    // 3 列目
    new MapSpace(s(2, 0), MapSpaceType.PLAIN, '', 0, 0, [null, null, null, s(2, 1), s(1, 0), null]),
    new MapSpace(s(2, 1), MapSpaceType.PLAIN, '', 0, 0, [s(2, 0), null, null, s(2, 2), s(1, 1), s(1, 0)]),
    new MapSpace(s(2, 2), MapSpaceType.CITY, '', 0, 0, [s(2, 1), null, null, null, s(1, 2), s(1, 1)])
  ],
  [
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 }),
    new CityTile(1, '', CityTileColor.RED, { mapSpaceId: s(0, 1), goodsCubesQuantity: 2 })
  ]
]

// eslint-disable-next-line @typescript-eslint/naming-convention
const mapC3R3_3: [MapSpace[], CityTile[]] = [
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
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 })
  ]
]

test('actionBuildTrackTile 新規配置できること。新規配置した線路はすべて自信の線路になること', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 1本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)

      // 2本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(true)
      expect(trackTiles[52].mapSpace?.id).toBe(s(0, 2))
      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)

      // 3本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(53, 2, s(1, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[53].isPlaced).toBe(true)
      expect(trackTiles[53].mapSpace?.id).toBe(s(1, 2))
      expect(trackTiles[53].lines[0].owner?.id).toBe(0)
      expect(trackTiles[53].lines[1].owner?.id).toBe(0)

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 自身の線路の方向転換', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 所有者なし線路の方向転換', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner).toBeNull() // 方向転換だけでは所有権を得られない
      expect(trackTiles[0].lines[1].owner).toBeNull() // 方向転換だけでは所有権を得られない
    }
  )
})

test('actionBuildTrackTile 自身の線路の方向転換して所有者なし線路に接続した場合、自身が所有者となる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 一本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        // 二本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(0, 2)), 3)
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)

      expect(trackTiles[53].lines[0].owner?.id).toBe(0) // 自身が所有者になる
      expect(trackTiles[53].lines[1].owner?.id).toBe(0) // 自身が所有者になる
      expect(trackTiles[54].lines[0].owner?.id).toBe(0) // 自身が所有者になる
      expect(trackTiles[54].lines[1].owner?.id).toBe(0) // 自身が所有者になる
    }
  )
})

test('actionBuildTrackTile 所有者なし線路を方向転換して自信の線路に接続された場合は自信が所有者になる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 一本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        // 二本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(0, 2)), 3)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .setLineOwner(trackTiles[54].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[54].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0) // 自身が所有者になる
      expect(trackTiles[0].lines[1].owner?.id).toBe(0) // 自身が所有者になる

      expect(trackTiles[53].lines[0].owner?.id).toBe(0)
      expect(trackTiles[53].lines[1].owner?.id).toBe(0)
      expect(trackTiles[54].lines[0].owner?.id).toBe(0)
      expect(trackTiles[54].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 所有者なし線路を方向転換して所有者なし線路に接続された場合は自信が所有者になる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 一本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        // 二本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(0, 2)), 3)
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0) // 自身が所有者になる
      expect(trackTiles[0].lines[1].owner?.id).toBe(0) // 自身が所有者になる

      expect(trackTiles[53].lines[0].owner?.id).toBe(0)
      expect(trackTiles[53].lines[1].owner?.id).toBe(0)
      expect(trackTiles[54].lines[0].owner?.id).toBe(0)
      expect(trackTiles[54].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 所有者なし線路を方向転換して都市に接続した場合は自信が所有者になる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 4)
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(0, 2)), 3)
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 2)), 2)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(0, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
      expect(trackTiles[53].lines[0].owner?.id).toBe(0)
      expect(trackTiles[53].lines[1].owner?.id).toBe(0)
      expect(trackTiles[54].lines[0].owner?.id).toBe(0)
      expect(trackTiles[54].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 所有者なし線路を拡張した場合、自信が所有者になる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(0, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 方向転換
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(true)
      expect(trackTiles[52].mapSpace?.id).toBe(s(0, 2))
      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 複数線路タイルで２つの都市から同時に線路を出す', () => {
  t(
    ...mapC3R3_2,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 3, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 2, s(1, 0))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 0))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0)
      expect(trackTiles[119].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 所有者なし線路を拡張と方向転換を同時に行う場合', () => {
  t(
    ...mapC3R3_3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 1本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        // 2本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 0)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(false)

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[1].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[2].owner).toBeNull() // 方向転換
      expect(trackTiles[119].lines[3].owner).toBeNull() // 方向転換

      expect(trackTiles[52].lines[0].owner?.id).toBe(0) // 拡張
      expect(trackTiles[52].lines[1].owner?.id).toBe(0) // 拡張
      expect(trackTiles[53].lines[0].owner).toBeNull() // 方向転換
      expect(trackTiles[53].lines[1].owner).toBeNull() // 方向転換
    }
  )
})

test('actionBuildTrackTile 自身が所有者の線路を拡張と方向転換を同時に行う場合', () => {
  t(
    ...mapC3R3_3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 1本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        // 2本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 0)
        .setLineOwner(trackTiles[0].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[0].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(false)

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[1].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[2].owner?.id).toBe(0) // 方向転換
      expect(trackTiles[119].lines[3].owner?.id).toBe(0) // 方向転換

      expect(trackTiles[52].lines[0].owner?.id).toBe(0) // 拡張
      expect(trackTiles[52].lines[1].owner?.id).toBe(0) // 拡張
      expect(trackTiles[53].lines[0].owner?.id).toBe(0) // 方向転換
      expect(trackTiles[53].lines[1].owner?.id).toBe(0) // 方向転換
    }
  )
})

test('actionBuildTrackTile 都市にタイルを配置（SimpleTrackTileを配置する場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0]).toBeInstanceOf(SimpleTrackTile)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[0].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[0].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 都市にタイルを配置（ComplexCoexistTrackTileを配置する場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119]).toBeInstanceOf(ComplexCoexistTrackTile)

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[119].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0)
      expect(trackTiles[119].lines[1].owner?.id).toBe(0)
      expect(trackTiles[119].lines[2].owner?.id).toBe(0)
      expect(trackTiles[119].lines[3].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 都市にタイルを配置（TownTrackTileを配置する場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(141, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[141]).toBeInstanceOf(TownTrackTile)

      expect(trackTiles[141].isPlaced).toBe(true)
      expect(trackTiles[141].town).toBeInstanceOf(Town)
      expect((trackTiles[141].town as Town).trackTileId).toBe(141)
      expect(townMarkers[0].isPlaced).toBe(false)
      expect(trackTiles[141].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[141].lines[0].owner?.id).toBe(0)
      expect(trackTiles[141].lines[1].owner?.id).toBe(0)
      expect(trackTiles[141].lines[2].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 都市にタイルを配置（自身が所有者の線路が複数同時に接続される場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        // 1本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        // 2本目
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 0)), 0)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(false)

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[119].town as TownMarker).id).toBe(0)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0)
      expect(trackTiles[119].lines[1].owner?.id).toBe(0)
      expect(trackTiles[119].lines[2].owner?.id).toBe(0)
      expect(trackTiles[119].lines[3].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 都市にタイルを配置（所有者なし線路から接続する場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3) // 所有者なし
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0]).toBeInstanceOf(SimpleTrackTile)

      expect(trackTiles[0].isPlaced).toBe(true)
      expect(trackTiles[0].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[0].town as TownMarker).id).toBe(0)
      expect(trackTiles[0].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)

      expect(trackTiles[52].lines[0].owner?.id).toBe(0) // 拡張したので所有者になる
      expect(trackTiles[52].lines[1].owner?.id).toBe(0) // 拡張したので所有者になる
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .setLineOwner(trackTiles[0].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[0].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(127, 2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(false)

      expect(trackTiles[127].isPlaced).toBe(true)
      expect(trackTiles[127].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[127].town as TownMarker).id).toBe(0) // 元々使われていたTownMarkerを再利用
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[127].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[127].lines[0].owner?.id).toBe(0)
      expect(trackTiles[127].lines[1].owner?.id).toBe(0)
      expect(trackTiles[127].lines[2].owner?.id).toBe(0)
      expect(trackTiles[127].lines[3].owner?.id).toBe(0)

      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え（所有者なし線路を置き換えても所有者にはならない。追加した線路は自身の線路になる）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(127, 2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].isPlaced).toBe(false)

      expect(trackTiles[127].isPlaced).toBe(true)
      expect(trackTiles[127].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[127].town as TownMarker).id).toBe(0) // 元々使われていたTownMarkerを再利用
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[127].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[127].lines[0].owner).toBeNull() // 置き換え
      expect(trackTiles[127].lines[1].owner).toBeNull() // 置き換え
      expect(trackTiles[127].lines[2].owner?.id).toBe(0) // 追加
      expect(trackTiles[127].lines[3].owner?.id).toBe(0) // 追加

      expect(trackTiles[52].lines[0].owner).toBeNull()
      expect(trackTiles[52].lines[1].owner).toBeNull()
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え（所有者なし線路のSimpleTrackTileをTownTrackTileに置き換えた場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(144, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[144]).toBeInstanceOf(TownTrackTile)

      expect(trackTiles[144].isPlaced).toBe(true)
      expect(trackTiles[144].town).toBeInstanceOf(Town)
      expect((trackTiles[144].town as Town).trackTileId).toBe(144)
      expect(townMarkers[0].isPlaced).toBe(false) // TownMarkerが解放される
      expect(trackTiles[144].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[144].lines[0].owner).toBeNull()
      expect(trackTiles[144].lines[1].owner).toBeNull()
      expect(trackTiles[144].lines[2].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え（自身が所有している線路のSimpleTrackTileをTownTrackTileに置き換えた場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(1, 1)), 2)
        .setLineOwner(trackTiles[0].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[0].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(144, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[144]).toBeInstanceOf(TownTrackTile)

      expect(trackTiles[144].isPlaced).toBe(true)
      expect(trackTiles[144].town).toBeInstanceOf(Town)
      expect((trackTiles[144].town as Town).trackTileId).toBe(144)
      expect(townMarkers[0].isPlaced).toBe(false) // TownMarkerが解放される
      expect(trackTiles[144].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[144].lines[0].owner?.id).toBe(0)
      expect(trackTiles[144].lines[1].owner?.id).toBe(0)
      expect(trackTiles[144].lines[2].owner?.id).toBe(0)
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え（所有者なし線路のTownTrackTileをComplexCrossingTrackTileに置き換えた場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .placeTrackTileToMapSpace(trackTiles[144], getMapSpace(s(1, 1)), 2) // 0, 3, 5
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(132, 2, s(1, 1)) // 0, 3, 2, 5
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[132]).toBeInstanceOf(ComplexCrossingTrackTile)

      expect(trackTiles[132].isPlaced).toBe(true)
      expect(trackTiles[132].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[132].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[132].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[132].lines[0].owner).toBeNull()
      expect(trackTiles[132].lines[1].owner).toBeNull()
      expect(trackTiles[132].lines[2].owner?.id).toBe(0) // 新規
      expect(trackTiles[132].lines[3].owner).toBeNull()
    }
  )
})

test('actionBuildTrackTile 町タイルの置き換え（自信が所有者の線路のTownTrackTileをComplexCrossingTrackTileに置き換えた場合）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[144], getMapSpace(s(1, 1)), 2) // 0, 3, 5
        .setLineOwner(trackTiles[144].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[144].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[144].lines[2], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(132, 2, s(1, 1)) // 0, 3, 2, 5
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[132]).toBeInstanceOf(ComplexCrossingTrackTile)

      expect(trackTiles[132].isPlaced).toBe(true)
      expect(trackTiles[132].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[132].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[132].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[132].lines[0].owner?.id).toBe(0)
      expect(trackTiles[132].lines[1].owner?.id).toBe(0)
      expect(trackTiles[132].lines[2].owner?.id).toBe(0) // 新規
      expect(trackTiles[132].lines[3].owner?.id).toBe(0)
    }
  )
})

test('actionBuildCityTile 町スペースに都市を配置', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(cityTiles[2].isPlaced).toBe(true)
      expect(cityTiles[2].mapSpace?.id).toBe(s(1, 1))
    }
  )
})

test('actionBuildCityTile 町スペースに都市を配置（所有者なし線路を完成させた場合は自身が所有者になる）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(cityTiles[2].isPlaced).toBe(true)
      expect(cityTiles[2].mapSpace?.id).toBe(s(1, 1))

      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionBuildCityTile 町スペースに都市を配置（所有者なし線路に接続していても完成しない場合は自身が所有者にならない）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 2)
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[53])
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(2, 1)), 1)
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(cityTiles[2].isPlaced).toBe(true)
      expect(cityTiles[2].mapSpace?.id).toBe(s(1, 1))

      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)

      expect(trackTiles[54].lines[0].owner).toBeNull()
      expect(trackTiles[54].lines[1].owner).toBeNull()

      expect(townMarkers[0].isPlaced).toBe(false)
    }
  )
})

test('actionCompleteBuild 拡張しなかった線路は所有権を失う', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].lines[0].owner).toBeNull()
      expect(trackTiles[52].lines[1].owner).toBeNull()
    }
  )
})

test('actionCompleteBuild 拡張した線路は所有権を失わない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 2, s(1, 1)) // 拡張
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionCompleteBuild 方向転換しただけの線路は所有権を失う', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1)) // 拡張
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].lines[0].owner).toBeNull()
      expect(trackTiles[0].lines[1].owner).toBeNull()
    }
  )
})

test('actionCompleteBuild 方向転換しただけの線路は所有権を失う', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1)) // 方向転換
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[52].isPlaced).toBe(false)

      expect(trackTiles[0].lines[0].owner).toBeNull()
      expect(trackTiles[0].lines[1].owner).toBeNull()
    }
  )
})

test('actionCompleteBuild 方向転換および拡張した線路は所有権を失わない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000002', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1)) // 方向転換
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
      expect((g.phase as BuildTrackPhase).newLines.length).toBe(0)

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2)) // 拡張（置き換えたタイルを再利用）
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)
      expect(trackTiles[52].isPlaced).toBe(true)
      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)
      expect((g.phase as BuildTrackPhase).newLines.length).toBe(2)

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[0].lines[0].owner?.id).toBe(0)
      expect(trackTiles[0].lines[1].owner?.id).toBe(0)

      expect(trackTiles[52].isPlaced).toBe(true)
      expect(trackTiles[52].lines[0].owner?.id).toBe(0)
      expect(trackTiles[52].lines[1].owner?.id).toBe(0)
    }
  )
})

test('actionCompleteBuild ComplexCoexistTrackTileで拡張と方向転換を同時に行なった場合、方向転換した線路のみ所有権を失う', () => {
  t(
    ...mapC3R3_3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
      // 1本目
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 1)), 0)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
      // 2本目
        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(1, 0)), 0)
        .setLineOwner(trackTiles[54].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[54].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(119, 5, s(1, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner?.id).toBe(0) // 方向転換
      expect(trackTiles[119].lines[1].owner?.id).toBe(0) // 方向転換
      expect(trackTiles[119].lines[2].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[3].owner?.id).toBe(0) // 拡張
      expect((g.phase as BuildTrackPhase).newLines.length).toBe(2)

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[119].isPlaced).toBe(true)
      expect(trackTiles[119].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[119].lines[0].owner).toBeNull() // 方向転換
      expect(trackTiles[119].lines[1].owner).toBeNull() // 方向転換
      expect(trackTiles[119].lines[2].owner?.id).toBe(0) // 拡張
      expect(trackTiles[119].lines[3].owner?.id).toBe(0) // 拡張
    }
  )
})

test('actionCompleteBuild 町タイルの置き換え（自信が所有者の線路のTownTrackTileをComplexCrossingTrackTileに置き換えた場合、拡張しなかった線路は所有権を失う）', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(0, 1)), 3)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .placeTrackTileToMapSpace(trackTiles[144], getMapSpace(s(1, 1)), 2) // 0, 3, 5
        .setLineOwner(trackTiles[144].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[144].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .setLineOwner(trackTiles[144].lines[2], new Player(0, '00000000-0000-0000-0000-000000000001', null, 2, 2, 10, 0, 1))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(132, 2, s(1, 1)) // 0, 3, 2, 5
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[132]).toBeInstanceOf(ComplexCrossingTrackTile)

      expect(trackTiles[132].isPlaced).toBe(true)
      expect(trackTiles[132].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[132].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[132].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[132].lines[0].owner?.id).toBe(0) // 置き換え（完成）
      expect(trackTiles[132].lines[1].owner?.id).toBe(0) // 置き換え（完成）
      expect(trackTiles[132].lines[2].owner?.id).toBe(0) // 新規
      expect(trackTiles[132].lines[3].owner?.id).toBe(0) // 置き換え
      expect((g.phase as BuildTrackPhase).newLines.length).toBe(1)

      g = (g.phase as BuildTrackPhase).actionCompleteBuild()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(trackTiles[132].isPlaced).toBe(true)
      expect(trackTiles[132].town).toBeInstanceOf(TownMarker)
      expect((trackTiles[132].town as TownMarker).id).toBe(0)
      expect(townMarkers[0].isPlaced).toBe(true)
      expect(trackTiles[132].mapSpace?.id).toBe(s(1, 1))
      expect(trackTiles[132].lines[0].owner?.id).toBe(0) // 置き換え（完成）
      expect(trackTiles[132].lines[1].owner?.id).toBe(0) // 置き換え（完成）
      expect(trackTiles[132].lines[2].owner?.id).toBe(0) // 新規
      expect(trackTiles[132].lines[3].owner).toBeNull() // 置き換え
    }
  )
})

test('actionBuildTrackTile 通常プレイヤーは線路タイルを3個、都市タイルを0個配置できる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.FIRST_MOVE, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 1本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 2本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 3本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(53, 2, s(1, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 4本目
      expect(() => (g.phase as BuildTrackPhase).actionBuildTrackTile(54, 2, s(1, 0))).toThrowError()

      // 都市タイル
      expect(() => (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))).toThrowError()
    }
  )
})

test('actionBuildTrackTile エンジニアアクションを選んだプレイヤーは線路タイルを4個、都市タイルを0個配置できる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.ENGINEER, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 1本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 2本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 3本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(53, 2, s(1, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 4本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(54, 2, s(1, 0))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 5本目
      expect(() => (g.phase as BuildTrackPhase).actionBuildTrackTile(111, 0, s(2, 0))).toThrowError()

      // 都市タイル
      expect(() => (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))).toThrowError()
    }
  )
})

test('actionBuildTrackTile 都市化アクションを選んだプレイヤーは線路タイルを3個、都市タイルを1個配置できる', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame()
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', Action.URBANIZATION, 1, 2, 10, 0, 1)
        ])
        .setPhase(new BuildTrackPhase([], [], []))
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 1本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(0, 0, s(0, 1))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 2本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(52, 3, s(0, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 3本目
      g = (g.phase as BuildTrackPhase).actionBuildTrackTile(53, 2, s(1, 2))
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      // 4本目
      expect(() => (g.phase as BuildTrackPhase).actionBuildTrackTile(54, 2, s(1, 0))).toThrowError()

      // 都市タイル
      g = (g.phase as BuildTrackPhase).actionBuildCityTile(2, s(1, 1))
    }
  )
})
