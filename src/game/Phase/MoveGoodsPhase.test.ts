import { MapSpaceType, CityTileColor } from 'enums'
import { type Game, GameBuilder, Player, User, setContext, MoveGoodsPhase } from 'game'
import { initializeGame } from 'initializeGame'
import { CityTile, MapSpace, mapSpaces, cityTiles, trackTiles, getMapSpace, goodsCubes, townMarkers, goodsDisplaySpaces } from 'objects'

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
    new MapSpace(s(0, 2), MapSpaceType.TOWN, '', 0, 0, [s(0, 1), s(1, 1), s(1, 2), null, null, null]),
    // 2 列目
    new MapSpace(s(1, 0), MapSpaceType.PLAIN, '', 0, 0, [null, s(2, 0), s(2, 1), s(1, 1), s(0, 1), s(0, 0)]),
    new MapSpace(s(1, 1), MapSpaceType.PLAIN, '', 0, 0, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
    new MapSpace(s(1, 2), MapSpaceType.PLAIN, '', 0, 0, [s(1, 1), s(2, 2), null, null, null, s(0, 2)]),
    // 3 列目
    new MapSpace(s(2, 0), MapSpaceType.TOWN, '', 0, 0, [null, null, null, s(2, 1), s(1, 0), null]),
    new MapSpace(s(2, 1), MapSpaceType.PLAIN, '', 0, 0, [s(2, 0), null, null, s(2, 2), s(1, 1), s(1, 0)]),
    new MapSpace(s(2, 2), MapSpaceType.CITY, '', 0, 0, [s(2, 1), null, null, null, s(1, 2), s(1, 1)])
  ],
  [
    new CityTile(0, '', CityTileColor.RED, { mapSpaceId: s(0, 0), goodsCubesQuantity: 2 }),
    new CityTile(1, '', CityTileColor.BLUE, { mapSpaceId: s(2, 2), goodsCubesQuantity: 2 })
  ]
]

test('canSelectGoodsCube マップ上に出ているキューブのみ選択可能', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new MoveGoodsPhase(null, [], 1, []))
        .placeGoodsCubeToMapSpace(goodsCubes[0], getMapSpace(s(0, 0)))
        .placeGoodsCubeToMapSpace(goodsCubes[20], getMapSpace(s(2, 2)))
        .placeGoodsCubeToGoodsDisplaySpace(goodsCubes[40], goodsDisplaySpaces[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canSelectGoodsCube(0)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canSelectGoodsCube(20)).toBe(true)

      expect((g.phase as MoveGoodsPhase).canSelectGoodsCube(40)).toBe(false)

      expect((g.phase as MoveGoodsPhase).canSelectGoodsCube(60)).toBe(false)
    }
  )
})

test('actionSelectGoodsCube', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new MoveGoodsPhase(null, [], 1, []))
        .placeGoodsCubeToMapSpace(goodsCubes[0], getMapSpace(s(0, 0)))
        .placeGoodsCubeToMapSpace(goodsCubes[20], getMapSpace(s(2, 2)))
        .placeGoodsCubeToGoodsDisplaySpace(goodsCubes[40], goodsDisplaySpaces[0])
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as MoveGoodsPhase).actionSelectGoodsCube(0)

      expect((g.phase as MoveGoodsPhase).selectedGoodsCube?.id).toBe(0)
      expect((g.phase as MoveGoodsPhase).currentMapSpace?.id).toBe(s(0, 0))

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as MoveGoodsPhase).actionSelectGoodsCube(20)

      expect((g.phase as MoveGoodsPhase).selectedGoodsCube?.id).toBe(20)
      expect((g.phase as MoveGoodsPhase).currentMapSpace?.id).toBe(s(2, 2))
    }
  )
})

test('canMoveGoodsCube/actionMoveGoodsCube/canCompleteMoving 移動力以上に移動できない。キューブを同じ色の都市まで移動させないと完了できない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 2),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new MoveGoodsPhase(null, [], 1, []))
        // マップ端を一周
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 2)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(2, 0)), 0)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[111])
        .setLineOwner(trackTiles[111].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[111].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(2, 1)), 0)
        .setLineOwner(trackTiles[0].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[0].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 2)), 5)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(0, 2)), 3)
        .placeTownMarkerToTrackTile(townMarkers[1], trackTiles[54])
        .setLineOwner(trackTiles[54].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[54].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .setLineOwner(trackTiles[1].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[1].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeGoodsCubeToMapSpace(goodsCubes[0], getMapSpace(s(0, 0))) // RED
        .placeGoodsCubeToMapSpace(goodsCubes[20], getMapSpace(s(0, 0))) // BLUE
        .placeGoodsCubeToMapSpace(goodsCubes[40], getMapSpace(s(0, 0))) // PURPLE
        .placeGoodsCubeToMapSpace(goodsCubes[60], getMapSpace(s(0, 0))) // YELLOW
        .placeGoodsCubeToMapSpace(goodsCubes[80], getMapSpace(s(0, 0))) // BLACK
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as MoveGoodsPhase).actionSelectGoodsCube(0)

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      // 都市から町に移動
      g = (g.phase as MoveGoodsPhase).actionMoveGoodsCube(2)
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false) // すでに通ったところは通れない
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      // 町から都市に移動
      g = (g.phase as MoveGoodsPhase).actionMoveGoodsCube(3)
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false) // 輸送力が足りないのでFalse
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      expect((g.phase as MoveGoodsPhase).canCompleteMoving()).toBe(false) // 都市とキューブの色が異なるので完了不可
    }
  )
})

test('canMoveGoodsCube/actionMoveGoodsCube/canCompleteMoving/actionCompleteMoving キューブと同じ色の都市に到達したらそれ以上移動できない', () => {
  t(
    ...mapC3R3,
    function () {
      g = initializeGame('00000000-0000-0000-0000-000000000000', new User('00000000-0000-0000-0000-000000000001', '山田太郎'))
      b = new GameBuilder(g)

      g = b
        .setUsers([
          new User('00000000-0000-0000-0000-000000000001', '山田太郎'),
          new User('00000000-0000-0000-0000-000000000002', '鈴木二郎')
        ])
        .setPlayers([
          new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 3),
          new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1)
        ])
        .setPhase(new MoveGoodsPhase(null, [], 1, []))
      // マップ端を一周
        .placeTrackTileToMapSpace(trackTiles[52], getMapSpace(s(1, 0)), 2)
        .setLineOwner(trackTiles[52].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[52].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[111], getMapSpace(s(2, 0)), 0)
        .placeTownMarkerToTrackTile(townMarkers[0], trackTiles[111])
        .setLineOwner(trackTiles[111].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[111].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[0], getMapSpace(s(2, 1)), 0)
        .setLineOwner(trackTiles[0].lines[0], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[0].lines[1], new Player(1, '00000000-0000-0000-0000-000000000002', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[53], getMapSpace(s(1, 2)), 5)
        .setLineOwner(trackTiles[53].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[53].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[54], getMapSpace(s(0, 2)), 3)
        .placeTownMarkerToTrackTile(townMarkers[1], trackTiles[54])
        .setLineOwner(trackTiles[54].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[54].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeTrackTileToMapSpace(trackTiles[1], getMapSpace(s(0, 1)), 0)
        .setLineOwner(trackTiles[1].lines[0], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))
        .setLineOwner(trackTiles[1].lines[1], new Player(0, '00000000-0000-0000-0000-000000000001', null, 1, 2, 10, 0, 1))

        .placeGoodsCubeToMapSpace(goodsCubes[0], getMapSpace(s(0, 0))) // RED
        .placeGoodsCubeToMapSpace(goodsCubes[20], getMapSpace(s(0, 0))) // BLUE
        .placeGoodsCubeToMapSpace(goodsCubes[40], getMapSpace(s(0, 0))) // PURPLE
        .placeGoodsCubeToMapSpace(goodsCubes[60], getMapSpace(s(0, 0))) // YELLOW
        .placeGoodsCubeToMapSpace(goodsCubes[80], getMapSpace(s(0, 0))) // BLACK
        .build()

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      g = (g.phase as MoveGoodsPhase).actionSelectGoodsCube(20) // BLUE

      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      // 都市から町に移動
      g = (g.phase as MoveGoodsPhase).actionMoveGoodsCube(2)
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(true)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false) // すでに通ったところは通れない
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      // 町から都市に移動
      g = (g.phase as MoveGoodsPhase).actionMoveGoodsCube(3)
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(0)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(1)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(2)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(3)).toBe(false)
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(4)).toBe(false) // すでに同じ色の都市に到達しているのでFalse
      expect((g.phase as MoveGoodsPhase).canMoveGoodsCube(5)).toBe(false)

      expect((g.phase as MoveGoodsPhase).canCompleteMoving()).toBe(true) // 移動完了できる

      // 移動完了
      g = (g.phase as MoveGoodsPhase).actionCompleteMoving()
      setContext(g, new User('00000000-0000-0000-0000-000000000001', '山田太郎'))

      expect(g.players[0].income).toBe(1)
      expect(g.players[1].income).toBe(1)

      expect(g.turnPlayer.id).toBe(1)
    }
  )
})
