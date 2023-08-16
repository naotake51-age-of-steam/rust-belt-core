import { CityTileColor, GoodsCubeColor, MapSpaceType, TrackTileType } from 'enums'
import { GoodsCube, MapSpace, TownMarker } from 'objects'
import { range } from 'utility'
import { CityTile } from './CityTile'
import { ClothBag } from './ClothBag'
import { GoodsDisplay, GoodsDisplayLine, GoodsDisplaySpace } from './GoodsDisplay'
import { type TrackTile, SimpleTrackTile, ComplexCoexistTrackTile, ComplexCrossingTrackTile, TownTrackTile, Line, Town } from './TrackTile'

export * from './CityTile'
export * from './GoodsCube'
export * from './MapSpace'
export * from './TrackTile'
export * from './TownMarker'
export * from './GoodsDisplay'
export * from './ClothBag'

export const reverseDirection = (direction: number): number => (direction + 3) % 6

const DX = 75
const DY = 86.5

export const s = (col: number, row: number): number => col * 11 + row

export const mapSpaces: Readonly<Array<MapSpace | null>> = [
  // 1列目
  new MapSpace(s(0, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 0, [null, null, s(1, 0), s(0, 1), null, null]),
  new MapSpace(s(0, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 1, [s(0, 0), s(1, 0), s(1, 1), s(0, 2), null, null]),
  new MapSpace(s(0, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 2, [s(0, 1), s(1, 1), s(1, 2), s(0, 3), null, null]),
  new MapSpace(s(0, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 3, [s(0, 2), s(1, 2), s(1, 3), s(0, 4), null, null]),
  new MapSpace(s(0, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 4, [s(0, 3), s(1, 3), s(1, 4), s(0, 5), null, null]),
  new MapSpace(s(0, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 5, [s(0, 4), s(1, 4), s(1, 5), s(0, 6), null, null]),
  new MapSpace(s(0, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 6, [s(0, 5), s(1, 5), s(1, 6), s(0, 7), null, null]),
  new MapSpace(s(0, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 7, [s(0, 6), s(1, 6), s(1, 7), s(0, 8), null, null]),
  new MapSpace(s(0, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 8, [s(0, 7), s(1, 7), s(1, 8), s(0, 9), null, null]),
  new MapSpace(s(0, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 0, DY * 9, [s(0, 8), s(1, 8), s(1, 9), s(0, 10), null, null]),
  new MapSpace(s(0, 10), MapSpaceType.CITY, '/img/plain.svg', DX * 0, DY * 10, [s(0, 9), s(1, 9), null, null, null, null]),
  // 2列目
  new MapSpace(s(1, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 0.5, [null, s(2, 0), s(2, 1), s(1, 1), s(0, 1), s(0, 0)]),
  new MapSpace(s(1, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 1.5, [s(1, 0), s(2, 1), s(2, 2), s(1, 2), s(0, 2), s(0, 1)]),
  new MapSpace(s(1, 2), MapSpaceType.CITY, '/img/plain.svg', DX * 1, DY * 2.5, [s(1, 1), s(2, 2), s(2, 3), s(1, 3), s(0, 3), s(0, 2)]),
  new MapSpace(s(1, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 3.5, [s(1, 2), s(2, 3), s(2, 4), s(1, 4), s(0, 4), s(0, 3)]),
  new MapSpace(s(1, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 4.5, [s(1, 3), s(2, 4), s(2, 5), s(1, 5), s(0, 5), s(0, 4)]),
  new MapSpace(s(1, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 5.5, [s(1, 4), s(2, 5), s(2, 6), s(1, 6), s(0, 6), s(0, 5)]),
  new MapSpace(s(1, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 6.5, [s(1, 5), s(2, 6), s(2, 7), s(1, 7), s(0, 7), s(0, 6)]),
  new MapSpace(s(1, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 7.5, [s(1, 6), s(2, 7), s(2, 8), s(1, 8), s(0, 8), s(0, 7)]),
  new MapSpace(s(1, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 8.5, [s(1, 7), s(2, 8), s(2, 9), s(1, 9), s(0, 9), s(0, 8)]),
  new MapSpace(s(1, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 1, DY * 9.5, [s(1, 8), s(2, 9), s(2, 10), null, s(0, 10), s(0, 9)]),
  null,
  // 3列目
  new MapSpace(s(2, 0), MapSpaceType.CITY, '/img/plain.svg', DX * 2, DY * 0, [null, null, s(3, 0), s(2, 1), s(1, 0), null]),
  new MapSpace(s(2, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 1, [s(2, 0), s(3, 0), s(3, 1), s(2, 2), s(1, 1), s(1, 0)]),
  new MapSpace(s(2, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 2, [s(2, 1), s(3, 1), s(3, 2), s(2, 3), s(1, 2), s(1, 1)]),
  new MapSpace(s(2, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 3, [s(2, 2), s(3, 2), s(3, 3), s(2, 4), s(1, 3), s(1, 2)]),
  new MapSpace(s(2, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 4, [s(2, 3), s(3, 3), s(3, 4), s(2, 5), s(1, 4), s(1, 3)]),
  new MapSpace(s(2, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 5, [s(2, 4), s(3, 4), s(3, 5), s(2, 6), s(1, 5), s(1, 4)]),
  new MapSpace(s(2, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 6, [s(2, 5), s(3, 5), s(3, 6), s(2, 7), s(1, 6), s(1, 5)]),
  new MapSpace(s(2, 7), MapSpaceType.CITY, '/img/plain.svg', DX * 2, DY * 7, [s(2, 6), s(3, 6), s(3, 7), s(2, 8), s(1, 7), s(1, 6)]),
  new MapSpace(s(2, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 8, [s(2, 7), s(3, 7), s(3, 8), s(2, 9), s(1, 8), s(1, 7)]),
  new MapSpace(s(2, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 9, [s(2, 8), s(3, 8), s(3, 9), s(2, 10), s(1, 9), s(1, 8)]),
  new MapSpace(s(2, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 2, DY * 10, [s(2, 9), s(3, 9), null, null, null, s(1, 9)]),
  // 4列目
  new MapSpace(s(3, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 3, DY * 0.5, [null, s(4, 0), s(4, 1), s(3, 1), s(2, 1), s(2, 0)]),
  new MapSpace(s(3, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 1.5, [s(3, 0), s(4, 1), s(4, 2), s(3, 2), s(2, 2), s(2, 1)]),
  new MapSpace(s(3, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 2.5, [s(3, 1), s(4, 2), s(4, 3), s(3, 3), s(2, 3), s(2, 2)]),
  new MapSpace(s(3, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 3.5, [s(3, 2), s(4, 3), s(4, 4), s(3, 4), s(2, 4), s(2, 3)]),
  new MapSpace(s(3, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 4.5, [s(3, 3), s(4, 4), s(4, 5), s(3, 5), s(2, 5), s(2, 4)]),
  new MapSpace(s(3, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 5.5, [s(3, 4), s(4, 5), s(4, 6), s(3, 6), s(2, 6), s(2, 5)]),
  new MapSpace(s(3, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 6.5, [s(3, 5), s(4, 6), s(4, 7), s(3, 7), s(2, 7), s(2, 6)]),
  new MapSpace(s(3, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 7.5, [s(3, 6), s(4, 7), s(4, 8), s(3, 8), s(2, 8), s(2, 7)]),
  new MapSpace(s(3, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 8.5, [s(3, 7), s(4, 8), s(4, 9), s(3, 9), s(2, 9), s(2, 8)]),
  new MapSpace(s(3, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 3, DY * 9.5, [s(3, 8), s(4, 9), s(4, 10), null, s(2, 10), s(2, 9)]),
  null,
  // 5列目
  new MapSpace(s(4, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 4, DY * 0, [null, null, s(5, 0), s(4, 1), s(3, 0), null]),
  new MapSpace(s(4, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 1, [s(4, 0), s(5, 0), s(5, 1), s(4, 2), s(3, 1), s(3, 0)]),
  new MapSpace(s(4, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 2, [s(4, 1), s(5, 1), s(5, 2), s(4, 3), s(3, 2), s(3, 1)]),
  new MapSpace(s(4, 3), MapSpaceType.TOWN, '/img/town.svg', DX * 4, DY * 3, [s(4, 2), s(5, 2), s(5, 3), s(4, 4), s(3, 3), s(3, 2)]),
  new MapSpace(s(4, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 4, [s(4, 3), s(5, 3), s(5, 4), s(4, 5), s(3, 4), s(3, 3)]),
  new MapSpace(s(4, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 5, [s(4, 4), s(5, 4), s(5, 5), s(4, 6), s(3, 5), s(3, 4)]),
  new MapSpace(s(4, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 6, [s(4, 5), s(5, 5), s(5, 6), s(4, 7), s(3, 6), s(3, 5)]),
  new MapSpace(s(4, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 7, [s(4, 6), s(5, 6), s(5, 7), s(4, 8), s(3, 7), s(3, 6)]),
  new MapSpace(s(4, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 8, [s(4, 7), s(5, 7), s(5, 8), s(4, 9), s(3, 8), s(3, 7)]),
  new MapSpace(s(4, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 9, [s(4, 8), s(5, 8), s(5, 9), s(4, 10), s(3, 9), s(3, 8)]),
  new MapSpace(s(4, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 4, DY * 10, [s(4, 9), s(5, 9), null, null, null, s(3, 9)]),
  // 6列目
  new MapSpace(s(5, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 0.5, [null, s(6, 0), s(6, 1), s(5, 1), s(4, 1), s(4, 0)]),
  new MapSpace(s(5, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 1.5, [s(5, 0), s(6, 1), s(6, 2), s(5, 2), s(4, 2), s(4, 1)]),
  new MapSpace(s(5, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 2.5, [s(5, 1), s(6, 2), s(6, 3), s(5, 3), s(4, 3), s(4, 2)]),
  new MapSpace(s(5, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 3.5, [s(5, 2), s(6, 3), s(6, 4), s(5, 4), s(4, 4), s(4, 3)]),
  new MapSpace(s(5, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 4.5, [s(5, 3), s(6, 4), s(6, 5), s(5, 5), s(4, 5), s(4, 4)]),
  new MapSpace(s(5, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 5.5, [s(5, 4), s(6, 5), s(6, 6), s(5, 6), s(4, 6), s(4, 5)]),
  new MapSpace(s(5, 6), MapSpaceType.TOWN, '/img/town.svg', DX * 5, DY * 6.5, [s(5, 5), s(6, 6), s(6, 7), s(5, 7), s(4, 7), s(4, 6)]),
  new MapSpace(s(5, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 7.5, [s(5, 6), s(6, 7), s(6, 8), s(5, 8), s(4, 8), s(4, 7)]),
  new MapSpace(s(5, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 5, DY * 8.5, [s(5, 7), s(6, 8), s(6, 9), s(5, 9), s(4, 9), s(4, 8)]),
  new MapSpace(s(5, 9), MapSpaceType.CITY, '/img/plain.svg', DX * 5, DY * 9.5, [s(5, 8), s(6, 9), s(6, 10), null, s(4, 10), s(4, 9)]),
  null,
  // 7列目
  new MapSpace(s(6, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 0, [null, null, s(7, 0), s(6, 1), s(5, 0), null]),
  new MapSpace(s(6, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 1, [s(6, 0), s(7, 0), s(7, 1), s(6, 2), s(5, 1), s(5, 0)]),
  new MapSpace(s(6, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 2, [s(6, 1), s(7, 1), s(7, 2), s(6, 3), s(5, 2), s(5, 1)]),
  new MapSpace(s(6, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 3, [s(6, 2), s(7, 2), s(7, 3), s(6, 4), s(5, 3), s(5, 2)]),
  new MapSpace(s(6, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 4, [s(6, 3), s(7, 3), s(7, 4), s(6, 5), s(5, 4), s(5, 3)]),
  new MapSpace(s(6, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 5, [s(6, 4), s(7, 4), s(7, 5), s(6, 6), s(5, 5), s(5, 4)]),
  new MapSpace(s(6, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 6, [s(6, 5), s(7, 5), s(7, 6), s(6, 7), s(5, 6), s(5, 5)]),
  new MapSpace(s(6, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 7, [s(6, 6), s(7, 6), s(7, 7), s(6, 8), s(5, 7), s(5, 6)]),
  new MapSpace(s(6, 8), MapSpaceType.TOWN, '/img/town.svg', DX * 6, DY * 8, [s(6, 7), s(7, 7), s(7, 8), s(6, 9), s(5, 8), s(5, 7)]),
  new MapSpace(s(6, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 9, [s(6, 8), s(7, 8), s(7, 9), s(6, 10), s(5, 9), s(5, 8)]),
  new MapSpace(s(6, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 6, DY * 10, [s(6, 9), s(7, 9), null, null, null, s(5, 9)]),
  // 8列目
  new MapSpace(s(7, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 0.5, [null, s(8, 0), s(8, 1), s(7, 1), s(6, 1), s(6, 0)]),
  new MapSpace(s(7, 1), MapSpaceType.TOWN, '/img/town.svg', DX * 7, DY * 1.5, [s(7, 0), s(8, 1), s(8, 2), s(7, 2), s(6, 2), s(6, 1)]),
  new MapSpace(s(7, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 2.5, [s(7, 1), s(8, 2), s(8, 3), s(7, 3), s(6, 3), s(6, 2)]),
  new MapSpace(s(7, 3), MapSpaceType.TOWN, '/img/town.svg', DX * 7, DY * 3.5, [s(7, 2), s(8, 3), s(8, 4), s(7, 4), s(6, 4), s(6, 3)]),
  new MapSpace(s(7, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 4.5, [s(7, 3), s(8, 4), s(8, 5), s(7, 5), s(6, 5), s(6, 4)]),
  new MapSpace(s(7, 5), MapSpaceType.CITY, '/img/plain.svg', DX * 7, DY * 5.5, [s(7, 4), s(8, 5), s(8, 6), s(7, 6), s(6, 6), s(6, 5)]),
  new MapSpace(s(7, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 6.5, [s(7, 5), s(8, 6), s(8, 7), s(7, 7), s(6, 7), s(6, 6)]),
  new MapSpace(s(7, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 7.5, [s(7, 6), s(8, 7), s(8, 8), s(7, 8), s(6, 8), s(6, 7)]),
  new MapSpace(s(7, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 8.5, [s(7, 7), s(8, 8), s(8, 9), s(7, 9), s(6, 9), s(6, 8)]),
  new MapSpace(s(7, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 7, DY * 9.5, [s(7, 8), s(8, 9), s(8, 10), null, s(6, 10), s(6, 9)]),
  null,
  // 9列目
  new MapSpace(s(8, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 8, DY * 0, [null, null, s(9, 0), s(8, 1), s(7, 0), null]),
  new MapSpace(s(8, 1), MapSpaceType.LAKE, '/img/lake.svg', DX * 8, DY * 1, [s(8, 0), s(9, 0), s(9, 1), s(8, 2), s(7, 1), s(7, 0)]),
  new MapSpace(s(8, 2), MapSpaceType.LAKE, '/img/lake.svg', DX * 8, DY * 2, [s(8, 1), s(9, 1), s(9, 2), s(8, 3), s(7, 2), s(7, 1)]),
  new MapSpace(s(8, 3), MapSpaceType.LAKE, '/img/lake.svg', DX * 8, DY * 3, [s(8, 2), s(9, 2), s(9, 3), s(8, 4), s(7, 3), s(7, 2)]),
  new MapSpace(s(8, 4), MapSpaceType.LAKE, '/img/lake.svg', DX * 8, DY * 4, [s(8, 3), s(9, 3), s(9, 4), s(8, 5), s(7, 4), s(7, 3)]),
  new MapSpace(s(8, 5), MapSpaceType.LAKE, '/img/lake.svg', DX * 8, DY * 5, [s(8, 4), s(9, 4), s(9, 5), s(8, 6), s(7, 5), s(7, 4)]),
  new MapSpace(s(8, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 8, DY * 6, [s(8, 5), s(9, 5), s(9, 6), s(8, 7), s(7, 6), s(7, 5)]),
  new MapSpace(s(8, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 8, DY * 7, [s(8, 6), s(9, 6), s(9, 7), s(8, 8), s(7, 7), s(7, 6)]),
  new MapSpace(s(8, 8), MapSpaceType.TOWN, '/img/town.svg', DX * 8, DY * 8, [s(8, 7), s(9, 7), s(9, 8), s(8, 9), s(7, 8), s(7, 7)]),
  new MapSpace(s(8, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 8, DY * 9, [s(8, 8), s(9, 8), s(9, 9), s(8, 10), s(7, 9), s(7, 8)]),
  new MapSpace(s(8, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 8, DY * 10, [s(8, 9), s(9, 9), null, null, null, s(7, 9)]),
  // 10列目
  new MapSpace(s(9, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 9, DY * 0.5, [null, s(10, 0), s(10, 1), s(9, 1), s(8, 1), s(8, 0)]),
  new MapSpace(s(9, 1), MapSpaceType.LAKE, '/img/lake.svg', DX * 9, DY * 1.5, [s(9, 0), s(10, 1), s(10, 2), s(9, 2), s(8, 2), s(8, 1)]),
  new MapSpace(s(9, 2), MapSpaceType.LAKE, '/img/lake.svg', DX * 9, DY * 2.5, [s(9, 1), s(10, 2), s(10, 3), s(9, 3), s(8, 3), s(8, 2)]),
  new MapSpace(s(9, 3), MapSpaceType.LAKE, '/img/lake.svg', DX * 9, DY * 3.5, [s(9, 2), s(10, 3), s(10, 4), s(9, 4), s(8, 4), s(8, 3)]),
  new MapSpace(s(9, 4), MapSpaceType.LAKE, '/img/lake.svg', DX * 9, DY * 4.5, [s(9, 3), s(10, 4), s(10, 5), s(9, 5), s(8, 5), s(8, 4)]),
  new MapSpace(s(9, 5), MapSpaceType.TOWN, '/img/town.svg', DX * 9, DY * 5.5, [s(9, 4), s(10, 5), s(10, 6), s(9, 6), s(8, 6), s(8, 5)]),
  new MapSpace(s(9, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 9, DY * 6.5, [s(9, 5), s(10, 6), s(10, 7), s(9, 7), s(8, 7), s(8, 6)]),
  new MapSpace(s(9, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 9, DY * 7.5, [s(9, 6), s(10, 7), s(10, 8), s(9, 8), s(8, 8), s(8, 7)]),
  new MapSpace(s(9, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 9, DY * 8.5, [s(9, 7), s(10, 8), s(10, 9), s(9, 9), s(8, 9), s(8, 8)]),
  new MapSpace(s(9, 9), MapSpaceType.CITY, '/img/plain.svg', DX * 9, DY * 9.5, [s(9, 8), s(10, 9), s(10, 10), null, s(8, 10), s(8, 9)]),
  null,
  // 11列目
  new MapSpace(s(10, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 10, DY * 0, [null, null, s(11, 0), s(10, 1), s(9, 0), null]),
  new MapSpace(s(10, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 1, [s(10, 0), s(11, 0), s(11, 1), s(10, 2), s(9, 1), s(9, 0)]),
  new MapSpace(s(10, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 2, [s(10, 1), s(11, 1), s(11, 2), s(10, 3), s(9, 2), s(9, 1)]),
  new MapSpace(s(10, 3), MapSpaceType.TOWN, '/img/town.svg', DX * 10, DY * 3, [s(10, 2), s(11, 2), s(11, 3), s(10, 4), s(9, 3), s(9, 2)]),
  new MapSpace(s(10, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 4, [s(10, 3), s(11, 3), s(11, 4), s(10, 5), s(9, 4), s(9, 3)]),
  new MapSpace(s(10, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 5, [s(10, 4), s(11, 4), s(11, 5), s(10, 6), s(9, 5), s(9, 4)]),
  new MapSpace(s(10, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 6, [s(10, 5), s(11, 5), s(11, 6), s(10, 7), s(9, 6), s(9, 5)]),
  new MapSpace(s(10, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 7, [s(10, 6), s(11, 6), s(11, 7), s(10, 8), s(9, 7), s(9, 6)]),
  new MapSpace(s(10, 8), MapSpaceType.TOWN, '/img/town.svg', DX * 10, DY * 8, [s(10, 7), s(11, 7), s(11, 8), s(10, 9), s(9, 8), s(9, 7)]),
  new MapSpace(s(10, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 9, [s(10, 8), s(11, 8), s(11, 9), s(10, 10), s(9, 9), s(9, 8)]),
  new MapSpace(s(10, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 10, DY * 10, [s(10, 9), s(11, 9), null, null, null, s(9, 9)]),
  // 12列目
  new MapSpace(s(11, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 11, DY * 0.5, [null, s(12, 0), s(12, 1), s(11, 1), s(10, 1), s(10, 0)]),
  new MapSpace(s(11, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 1.5, [s(11, 0), s(12, 1), s(12, 2), s(11, 2), s(10, 2), s(10, 1)]),
  new MapSpace(s(11, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 2.5, [s(11, 1), s(12, 2), s(12, 3), s(11, 3), s(10, 3), s(10, 2)]),
  new MapSpace(s(11, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 3.5, [s(11, 2), s(12, 3), s(12, 4), s(11, 4), s(10, 4), s(10, 3)]),
  new MapSpace(s(11, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 4.5, [s(11, 3), s(12, 4), s(12, 5), s(11, 5), s(10, 5), s(10, 4)]),
  new MapSpace(s(11, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 5.5, [s(11, 4), s(12, 5), s(12, 6), s(11, 6), s(10, 6), s(10, 5)]),
  new MapSpace(s(11, 6), MapSpaceType.TOWN, '/img/town.svg', DX * 11, DY * 6.5, [s(11, 5), s(12, 6), s(12, 7), s(11, 7), s(10, 7), s(10, 6)]),
  new MapSpace(s(11, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 7.5, [s(11, 6), s(12, 7), s(12, 8), s(11, 8), s(10, 8), s(10, 7)]),
  new MapSpace(s(11, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 8.5, [s(11, 7), s(12, 8), s(12, 9), s(11, 9), s(10, 9), s(10, 8)]),
  new MapSpace(s(11, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 11, DY * 9.5, [s(11, 8), s(12, 9), s(12, 10), null, s(10, 10), s(10, 9)]),
  null,
  // 13列目
  new MapSpace(s(12, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 12, DY * 0, [null, null, s(13, 0), s(12, 1), s(11, 0), null]),
  new MapSpace(s(12, 1), MapSpaceType.LAKE, '/img/lake.svg', DX * 12, DY * 1, [s(12, 0), s(13, 0), s(13, 1), s(12, 2), s(11, 1), s(11, 0)]),
  new MapSpace(s(12, 2), MapSpaceType.LAKE, '/img/lake.svg', DX * 12, DY * 2, [s(12, 1), s(13, 1), s(13, 2), s(12, 3), s(11, 2), s(11, 1)]),
  new MapSpace(s(12, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 3, [s(12, 2), s(13, 2), s(13, 3), s(12, 4), s(11, 3), s(11, 2)]),
  new MapSpace(s(12, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 4, [s(12, 3), s(13, 3), s(13, 4), s(12, 5), s(11, 4), s(11, 3)]),
  new MapSpace(s(12, 5), MapSpaceType.TOWN, '/img/town.svg', DX * 12, DY * 5, [s(12, 4), s(13, 4), s(13, 5), s(12, 6), s(11, 5), s(11, 4)]),
  new MapSpace(s(12, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 6, [s(12, 5), s(13, 5), s(13, 6), s(12, 7), s(11, 6), s(11, 5)]),
  new MapSpace(s(12, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 7, [s(12, 6), s(13, 6), s(13, 7), s(12, 8), s(11, 7), s(11, 6)]),
  new MapSpace(s(12, 8), MapSpaceType.CITY, '/img/plain.svg', DX * 12, DY * 8, [s(12, 7), s(13, 7), s(13, 8), s(12, 9), s(11, 8), s(11, 7)]),
  new MapSpace(s(12, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 9, [s(12, 8), s(13, 8), s(13, 9), s(12, 10), s(11, 9), s(11, 8)]),
  new MapSpace(s(12, 10), MapSpaceType.PLAIN, '/img/plain.svg', DX * 12, DY * 10, [s(12, 9), s(13, 9), null, null, null, s(11, 9)]),
  // 14列目
  new MapSpace(s(13, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 13, DY * 0.5, [null, s(14, 0), s(14, 1), s(13, 1), s(12, 1), s(12, 0)]),
  new MapSpace(s(13, 1), MapSpaceType.LAKE, '/img/lake.svg', DX * 13, DY * 1.5, [s(13, 0), s(14, 1), s(14, 2), s(13, 2), s(12, 2), s(12, 1)]),
  new MapSpace(s(13, 2), MapSpaceType.LAKE, '/img/lake.svg', DX * 13, DY * 2.5, [s(13, 1), s(14, 2), s(14, 3), s(13, 3), s(12, 3), s(12, 2)]),
  new MapSpace(s(13, 3), MapSpaceType.CITY, '/img/plain.svg', DX * 13, DY * 3.5, [s(13, 2), s(14, 3), s(14, 4), s(13, 4), s(12, 4), s(12, 3)]),
  new MapSpace(s(13, 4), MapSpaceType.LAKE, '/img/lake.svg', DX * 13, DY * 4.5, [s(13, 3), s(14, 4), s(14, 5), s(13, 5), s(12, 5), s(12, 4)]),
  new MapSpace(s(13, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 13, DY * 5.5, [s(13, 4), s(14, 5), s(14, 6), s(13, 6), s(12, 6), s(12, 5)]),
  new MapSpace(s(13, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 13, DY * 6.5, [s(13, 5), s(14, 6), s(14, 7), s(13, 7), s(12, 7), s(12, 6)]),
  new MapSpace(s(13, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 13, DY * 7.5, [s(13, 6), s(14, 7), s(14, 8), s(13, 8), s(12, 8), s(12, 7)]),
  new MapSpace(s(13, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 13, DY * 8.5, [s(13, 7), s(14, 8), s(14, 9), s(13, 9), s(12, 9), s(12, 8)]),
  new MapSpace(s(13, 9), MapSpaceType.TOWN, '/img/town.svg', DX * 13, DY * 9.5, [s(13, 8), s(14, 9), s(14, 10), null, s(12, 10), s(12, 9)]),
  null,
  // 15列目
  new MapSpace(s(14, 0), MapSpaceType.LAKE, '/img/lake.svg', DX * 14, DY * 0, [null, null, s(15, 0), s(14, 1), s(13, 0), null]),
  new MapSpace(s(14, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 1, [s(14, 0), s(15, 0), s(15, 1), s(14, 2), s(13, 1), s(13, 0)]),
  new MapSpace(s(14, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 2, [s(14, 1), s(15, 1), s(15, 2), s(14, 3), s(13, 2), s(13, 1)]),
  new MapSpace(s(14, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 3, [s(14, 2), s(15, 2), s(15, 3), s(14, 4), s(13, 3), s(13, 2)]),
  new MapSpace(s(14, 4), MapSpaceType.LAKE, '/img/lake.svg', DX * 14, DY * 4, [s(14, 3), s(15, 3), s(15, 4), s(14, 5), s(13, 4), s(13, 3)]),
  new MapSpace(s(14, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 5, [s(14, 4), s(15, 4), s(15, 5), s(14, 6), s(13, 5), s(13, 4)]),
  new MapSpace(s(14, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 6, [s(14, 5), s(15, 5), s(15, 6), s(14, 7), s(13, 6), s(13, 5)]),
  new MapSpace(s(14, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 7, [s(14, 6), s(15, 6), s(15, 7), s(14, 8), s(13, 7), s(13, 6)]),
  new MapSpace(s(14, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 8, [s(14, 7), s(15, 7), s(15, 8), s(14, 9), s(13, 8), s(13, 7)]),
  new MapSpace(s(14, 9), MapSpaceType.PLAIN, '/img/plain.svg', DX * 14, DY * 9, [s(14, 8), s(15, 8), s(15, 9), s(14, 10), s(13, 9), s(13, 8)]),
  new MapSpace(s(14, 10), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 14, DY * 10, [s(14, 9), s(15, 9), null, null, null, s(13, 9)]),
  // 16列目
  new MapSpace(s(15, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 0.5, [null, s(16, 0), s(16, 1), s(15, 1), s(14, 1), s(14, 0)]),
  new MapSpace(s(15, 1), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 1.5, [s(15, 0), s(16, 1), s(16, 2), s(15, 2), s(14, 2), s(14, 1)]),
  new MapSpace(s(15, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 2.5, [s(15, 1), s(16, 2), s(16, 3), s(15, 3), s(14, 3), s(14, 2)]),
  new MapSpace(s(15, 3), MapSpaceType.LAKE, '/img/lake.svg', DX * 15, DY * 3.5, [s(15, 2), s(16, 3), s(16, 4), s(15, 4), s(14, 4), s(14, 3)]),
  new MapSpace(s(15, 4), MapSpaceType.TOWN, '/img/town.svg', DX * 15, DY * 4.5, [s(15, 3), s(16, 4), s(16, 5), s(15, 5), s(14, 5), s(14, 4)]),
  new MapSpace(s(15, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 5.5, [s(15, 4), s(16, 5), s(16, 6), s(15, 6), s(14, 6), s(14, 5)]),
  new MapSpace(s(15, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 6.5, [s(15, 5), s(16, 6), s(16, 7), s(15, 7), s(14, 7), s(14, 6)]),
  new MapSpace(s(15, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 7.5, [s(15, 6), s(16, 7), s(16, 8), s(15, 8), s(14, 8), s(14, 7)]),
  new MapSpace(s(15, 8), MapSpaceType.PLAIN, '/img/plain.svg', DX * 15, DY * 8.5, [s(15, 7), s(16, 8), s(16, 9), s(15, 9), s(14, 9), s(14, 8)]),
  new MapSpace(s(15, 9), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 15, DY * 9.5, [s(15, 8), s(16, 9), s(16, 10), null, s(14, 10), s(14, 9)]),
  null,
  // 17列目
  new MapSpace(s(16, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 0, [null, null, s(17, 0), s(16, 1), s(15, 0), null]),
  new MapSpace(s(16, 1), MapSpaceType.CITY, '/img/plain.svg', DX * 16, DY * 1, [s(16, 0), s(17, 0), s(17, 1), s(16, 2), s(15, 1), s(15, 0)]),
  new MapSpace(s(16, 2), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 2, [s(16, 1), s(17, 1), s(17, 2), s(16, 3), s(15, 2), s(15, 1)]),
  new MapSpace(s(16, 3), MapSpaceType.LAKE, '/img/lake.svg', DX * 16, DY * 3, [s(16, 2), s(17, 2), s(17, 3), s(16, 4), s(15, 3), s(15, 2)]),
  new MapSpace(s(16, 4), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 4, [s(16, 3), s(17, 3), s(17, 4), s(16, 5), s(15, 4), s(15, 3)]),
  new MapSpace(s(16, 5), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 5, [s(16, 4), s(17, 4), s(17, 5), s(16, 6), s(15, 5), s(15, 4)]),
  new MapSpace(s(16, 6), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 6, [s(16, 5), s(17, 5), s(17, 6), s(16, 7), s(15, 6), s(15, 5)]),
  new MapSpace(s(16, 7), MapSpaceType.PLAIN, '/img/plain.svg', DX * 16, DY * 7, [s(16, 6), s(17, 6), s(17, 7), s(16, 8), s(15, 7), s(15, 6)]),
  new MapSpace(s(16, 8), MapSpaceType.CITY, '/img/plain.svg', DX * 16, DY * 8, [s(16, 7), s(17, 7), s(17, 8), s(16, 9), s(15, 8), s(15, 7)]),
  new MapSpace(s(16, 9), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 16, DY * 9, [s(16, 8), s(17, 8), s(17, 9), s(16, 10), s(15, 9), s(15, 8)]),
  new MapSpace(s(16, 10), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 16, DY * 10, [s(16, 9), s(17, 9), null, null, null, s(15, 9)]),
  // 18列目
  new MapSpace(s(17, 0), MapSpaceType.PLAIN, '/img/plain.svg', DX * 17, DY * 0.5, [null, null, null, s(17, 1), s(16, 1), s(16, 0)]),
  new MapSpace(s(17, 1), MapSpaceType.LAKE, '/img/lake.svg', DX * 17, DY * 1.5, [s(17, 0), null, null, s(17, 2), s(16, 2), s(16, 1)]),
  new MapSpace(s(17, 2), MapSpaceType.TOWN, '/img/town.svg', DX * 17, DY * 2.5, [s(17, 1), null, null, s(17, 3), s(16, 3), s(16, 2)]),
  new MapSpace(s(17, 3), MapSpaceType.PLAIN, '/img/plain.svg', DX * 17, DY * 3.5, [s(17, 2), null, null, s(17, 4), s(16, 4), s(16, 3)]),
  new MapSpace(s(17, 4), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 17, DY * 4.5, [s(17, 3), null, null, s(17, 5), s(16, 5), s(16, 4)]),
  new MapSpace(s(17, 5), MapSpaceType.CITY, '/img/plain.svg', DX * 17, DY * 5.5, [s(17, 4), null, null, s(17, 6), s(16, 6), s(16, 5)]),
  new MapSpace(s(17, 6), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 17, DY * 6.5, [s(17, 5), null, null, s(17, 7), s(16, 7), s(16, 6)]),
  new MapSpace(s(17, 7), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 17, DY * 7.5, [s(17, 6), null, null, s(17, 8), s(16, 8), s(16, 7)]),
  new MapSpace(s(17, 8), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 17, DY * 8.5, [s(17, 7), null, null, s(17, 9), s(16, 9), s(16, 8)]),
  new MapSpace(s(17, 9), MapSpaceType.MOUNTAIN, '/img/mountain.svg', DX * 17, DY * 9.5, [s(17, 8), null, null, null, s(16, 10), s(16, 9)]),
  null
] as const

export const getMapSpace = (mapSpaceId: number): MapSpace => {
  const mapSpace = mapSpaces[mapSpaceId]
  if (mapSpace === null) {
    throw new Error('null-mapSpace access')
  }
  return mapSpace
}

export const cityTiles: Readonly<CityTile[]> = [
  new CityTile(0, '/img/city-white-1.svg', CityTileColor.RED, { mapSpaceId: s(7, 5), goodsCubesQuantity: 2 }),
  new CityTile(1, '/img/city-white-2.svg', CityTileColor.RED, { mapSpaceId: s(5, 9), goodsCubesQuantity: 2 }),
  new CityTile(2, '/img/city-white-3.svg', CityTileColor.PURPLE, { mapSpaceId: s(0, 10), goodsCubesQuantity: 2 }),
  new CityTile(3, '/img/city-white-4.svg', CityTileColor.BLUE, { mapSpaceId: s(2, 7), goodsCubesQuantity: 2 }),
  new CityTile(4, '/img/city-white-5.svg', CityTileColor.BLUE, { mapSpaceId: s(1, 2), goodsCubesQuantity: 2 }),
  new CityTile(5, '/img/city-white-6.svg', CityTileColor.PURPLE, { mapSpaceId: s(2, 0), goodsCubesQuantity: 2 }),
  new CityTile(6, '/img/city-black-1.svg', CityTileColor.BLUE, { mapSpaceId: s(9, 9), goodsCubesQuantity: 2 }),
  new CityTile(7, '/img/city-black-2.svg', CityTileColor.BLUE, { mapSpaceId: s(12, 8), goodsCubesQuantity: 2 }),
  new CityTile(8, '/img/city-black-3.svg', CityTileColor.RED, { mapSpaceId: s(13, 3), goodsCubesQuantity: 2 }),
  new CityTile(9, '/img/city-black-4.svg', CityTileColor.YELLOW, { mapSpaceId: s(16, 8), goodsCubesQuantity: 3 }),
  new CityTile(10, '/img/city-black-5.svg', CityTileColor.RED, { mapSpaceId: s(17, 5), goodsCubesQuantity: 3 }),
  new CityTile(11, '/img/city-black-6.svg', CityTileColor.YELLOW, { mapSpaceId: s(16, 1), goodsCubesQuantity: 2 }),
  new CityTile(12, '/img/city-white-a.svg', CityTileColor.RED),
  new CityTile(13, '/img/city-white-b.svg', CityTileColor.BLUE),
  new CityTile(14, '/img/city-white-c.svg', CityTileColor.BLACK),
  new CityTile(15, '/img/city-white-d.svg', CityTileColor.BLACK),
  new CityTile(16, '/img/city-black-e.svg', CityTileColor.YELLOW),
  new CityTile(17, '/img/city-black-f.svg', CityTileColor.PURPLE),
  new CityTile(18, '/img/city-black-g.svg', CityTileColor.BLACK),
  new CityTile(19, '/img/city-black-h.svg', CityTileColor.BLACK)
] as const

export const trackTiles: Readonly<TrackTile[]> = [
  ...range(0, 51).map((id: number) => new SimpleTrackTile(id, TrackTileType.SIMPLE_TRACK_TILE_1, '/img/line-1.svg', [new Line(id, 0, 0), new Line(id, 1, 3)])),
  ...range(52, 110).map((id: number) => new SimpleTrackTile(id, TrackTileType.SIMPLE_TRACK_TILE_2, '/img/line-2.svg', [new Line(id, 0, 3), new Line(id, 1, 5)])),
  ...range(111, 118).map((id: number) => new SimpleTrackTile(id, TrackTileType.SIMPLE_TRACK_TILE_3, '/img/line-3.svg', [new Line(id, 0, 3), new Line(id, 1, 4)])),
  ...range(119, 120).map((id: number) => new ComplexCoexistTrackTile(id, TrackTileType.COMPLEX_COEXIST_TRACK_TILE_1, '/img/line-4.svg', [new Line(id, 0, 0), new Line(id, 1, 3), new Line(id, 2, 1), new Line(id, 3, 2)])),
  ...range(121, 122).map((id: number) => new ComplexCoexistTrackTile(id, TrackTileType.COMPLEX_COEXIST_TRACK_TILE_2, '/img/line-5.svg', [new Line(id, 0, 1), new Line(id, 1, 2), new Line(id, 2, 3), new Line(id, 3, 5)])),
  ...range(123, 124).map((id: number) => new ComplexCoexistTrackTile(id, TrackTileType.COMPLEX_COEXIST_TRACK_TILE_3, '/img/line-6.svg', [new Line(id, 0, 0), new Line(id, 1, 1), new Line(id, 2, 3), new Line(id, 3, 5)])),
  ...range(125, 126).map((id: number) => new ComplexCoexistTrackTile(id, TrackTileType.COMPLEX_COEXIST_TRACK_TILE_4, '/img/line-7.svg', [new Line(id, 0, 0), new Line(id, 1, 2), new Line(id, 2, 3), new Line(id, 3, 5)])),
  ...range(127, 131).map((id: number) => new ComplexCrossingTrackTile(id, TrackTileType.COMPLEX_CROSSING_TRACK_TILE_1, '/img/line-8.svg', [new Line(id, 0, 0), new Line(id, 1, 3), new Line(id, 2, 1), new Line(id, 3, 5)])),
  ...range(132, 136).map((id: number) => new ComplexCrossingTrackTile(id, TrackTileType.COMPLEX_CROSSING_TRACK_TILE_2, '/img/line-9.svg', [new Line(id, 0, 0), new Line(id, 1, 3), new Line(id, 2, 2), new Line(id, 3, 5)])),
  ...range(137, 140).map((id: number) => new ComplexCrossingTrackTile(id, TrackTileType.COMPLEX_CROSSING_TRACK_TILE_3, '/img/line-10.svg', [new Line(id, 0, 0), new Line(id, 1, 4), new Line(id, 2, 3), new Line(id, 3, 5)])),
  ...range(141, 143).map((id: number) => new TownTrackTile(id, TrackTileType.TOWN_TRACK_TILE_1, '/img/line-11.svg', [new Line(id, 0, 0), new Line(id, 1, 1), new Line(id, 2, 3)], new Town(id))),
  ...range(144, 146).map((id: number) => new TownTrackTile(id, TrackTileType.TOWN_TRACK_TILE_2, '/img/line-12.svg', [new Line(id, 0, 0), new Line(id, 1, 3), new Line(id, 2, 5)], new Town(id))),
  ...range(147, 149).map((id: number) => new TownTrackTile(id, TrackTileType.TOWN_TRACK_TILE_3, '/img/line-13.svg', [new Line(id, 0, 0), new Line(id, 1, 1), new Line(id, 2, 5)], new Town(id))),
  ...range(150, 152).map((id: number) => new TownTrackTile(id, TrackTileType.TOWN_TRACK_TILE_4, '/img/line-14.svg', [new Line(id, 0, 0), new Line(id, 1, 2), new Line(id, 2, 4)], new Town(id))),
  ...range(153, 156).map((id: number) => new TownTrackTile(id, TrackTileType.TOWN_TRACK_TILE_5, '/img/line-15.svg', [new Line(id, 0, 0)], new Town(id)))
] as const

export const goodsCubes: Readonly<GoodsCube[]> = [
  ...range(0, 19).map((id) => new GoodsCube(id, GoodsCubeColor.RED)),
  ...range(20, 39).map((id) => new GoodsCube(id, GoodsCubeColor.BLUE)),
  ...range(40, 59).map((id) => new GoodsCube(id, GoodsCubeColor.PURPLE)),
  ...range(60, 79).map((id) => new GoodsCube(id, GoodsCubeColor.YELLOW)),
  ...range(80, 95).map((id) => new GoodsCube(id, GoodsCubeColor.BLACK))
] as const

const GX = 5 // TODO:: 仮
const GY = 5 // TODO:: 仮
const GG = 10 // TODO:: 仮 1 ~ 6 と a ~ h の間のスペース

export const goodsDisplaySpaces = [
  new GoodsDisplaySpace(0, 0, GX * 0, GY * 0),
  new GoodsDisplaySpace(1, 0, GX * 0, GY * 1),
  new GoodsDisplaySpace(2, 0, GX * 0, GY * 2),
  new GoodsDisplaySpace(3, 1, GX * 1, GY * 0),
  new GoodsDisplaySpace(4, 1, GX * 1, GY * 1),
  new GoodsDisplaySpace(5, 1, GX * 1, GY * 2),
  new GoodsDisplaySpace(6, 2, GX * 2, GY * 0),
  new GoodsDisplaySpace(7, 2, GX * 2, GY * 1),
  new GoodsDisplaySpace(8, 2, GX * 2, GY * 2),
  new GoodsDisplaySpace(9, 3, GX * 3, GY * 0),
  new GoodsDisplaySpace(10, 3, GX * 3, GY * 1),
  new GoodsDisplaySpace(11, 3, GX * 3, GY * 2),
  new GoodsDisplaySpace(12, 4, GX * 4, GY * 0),
  new GoodsDisplaySpace(13, 4, GX * 4, GY * 1),
  new GoodsDisplaySpace(14, 4, GX * 4, GY * 2),
  new GoodsDisplaySpace(15, 5, GX * 5, GY * 0),
  new GoodsDisplaySpace(16, 5, GX * 5, GY * 1),
  new GoodsDisplaySpace(17, 5, GX * 5, GY * 2),
  new GoodsDisplaySpace(18, 6, GX * 6, GY * 0),
  new GoodsDisplaySpace(19, 6, GX * 6, GY * 1),
  new GoodsDisplaySpace(20, 6, GX * 6, GY * 2),
  new GoodsDisplaySpace(21, 7, GX * 7, GY * 0),
  new GoodsDisplaySpace(22, 7, GX * 7, GY * 1),
  new GoodsDisplaySpace(23, 7, GX * 7, GY * 2),
  new GoodsDisplaySpace(24, 8, GX * 8, GY * 0),
  new GoodsDisplaySpace(25, 8, GX * 8, GY * 1),
  new GoodsDisplaySpace(26, 8, GX * 8, GY * 2),
  new GoodsDisplaySpace(27, 9, GX * 9, GY * 0),
  new GoodsDisplaySpace(28, 9, GX * 9, GY * 1),
  new GoodsDisplaySpace(29, 9, GX * 9, GY * 2),
  new GoodsDisplaySpace(30, 10, GX * 10, GY * 0),
  new GoodsDisplaySpace(31, 10, GX * 10, GY * 1),
  new GoodsDisplaySpace(32, 10, GX * 10, GY * 2),
  new GoodsDisplaySpace(33, 11, GX * 11, GY * 0),
  new GoodsDisplaySpace(34, 11, GX * 11, GY * 1),
  new GoodsDisplaySpace(35, 11, GX * 11, GY * 2),
  new GoodsDisplaySpace(36, 12, GX * 2, GY * 3 + GG),
  new GoodsDisplaySpace(37, 12, GX * 2, GY * 4 + GG),
  new GoodsDisplaySpace(38, 13, GX * 3, GY * 3 + GG),
  new GoodsDisplaySpace(39, 13, GX * 3, GY * 4 + GG),
  new GoodsDisplaySpace(40, 14, GX * 4, GY * 3 + GG),
  new GoodsDisplaySpace(41, 14, GX * 4, GY * 4 + GG),
  new GoodsDisplaySpace(42, 15, GX * 5, GY * 3 + GG),
  new GoodsDisplaySpace(43, 15, GX * 5, GY * 4 + GG),
  new GoodsDisplaySpace(44, 16, GX * 6, GY * 3 + GG),
  new GoodsDisplaySpace(45, 16, GX * 6, GY * 4 + GG),
  new GoodsDisplaySpace(46, 17, GX * 7, GY * 3 + GG),
  new GoodsDisplaySpace(47, 17, GX * 7, GY * 4 + GG),
  new GoodsDisplaySpace(48, 18, GX * 8, GY * 3 + GG),
  new GoodsDisplaySpace(49, 18, GX * 8, GY * 4 + GG),
  new GoodsDisplaySpace(50, 19, GX * 9, GY * 3 + GG),
  new GoodsDisplaySpace(51, 19, GX * 9, GY * 4 + GG)
] as const

export const goodsDisplayLines = [
  new GoodsDisplayLine(0, cityTiles[0], [goodsDisplaySpaces[0], goodsDisplaySpaces[1], goodsDisplaySpaces[2]]),
  new GoodsDisplayLine(1, cityTiles[1], [goodsDisplaySpaces[3], goodsDisplaySpaces[4], goodsDisplaySpaces[5]]),
  new GoodsDisplayLine(2, cityTiles[2], [goodsDisplaySpaces[6], goodsDisplaySpaces[7], goodsDisplaySpaces[8]]),
  new GoodsDisplayLine(3, cityTiles[3], [goodsDisplaySpaces[9], goodsDisplaySpaces[10], goodsDisplaySpaces[11]]),
  new GoodsDisplayLine(4, cityTiles[4], [goodsDisplaySpaces[12], goodsDisplaySpaces[13], goodsDisplaySpaces[14]]),
  new GoodsDisplayLine(5, cityTiles[5], [goodsDisplaySpaces[15], goodsDisplaySpaces[16], goodsDisplaySpaces[17]]),
  new GoodsDisplayLine(6, cityTiles[6], [goodsDisplaySpaces[18], goodsDisplaySpaces[19], goodsDisplaySpaces[20]]),
  new GoodsDisplayLine(7, cityTiles[7], [goodsDisplaySpaces[21], goodsDisplaySpaces[22], goodsDisplaySpaces[23]]),
  new GoodsDisplayLine(8, cityTiles[8], [goodsDisplaySpaces[24], goodsDisplaySpaces[25], goodsDisplaySpaces[26]]),
  new GoodsDisplayLine(9, cityTiles[9], [goodsDisplaySpaces[27], goodsDisplaySpaces[28], goodsDisplaySpaces[29]]),
  new GoodsDisplayLine(10, cityTiles[10], [goodsDisplaySpaces[30], goodsDisplaySpaces[31], goodsDisplaySpaces[32]]),
  new GoodsDisplayLine(11, cityTiles[11], [goodsDisplaySpaces[33], goodsDisplaySpaces[34], goodsDisplaySpaces[35]]),
  new GoodsDisplayLine(12, cityTiles[12], [goodsDisplaySpaces[36], goodsDisplaySpaces[37]]),
  new GoodsDisplayLine(13, cityTiles[13], [goodsDisplaySpaces[38], goodsDisplaySpaces[39]]),
  new GoodsDisplayLine(14, cityTiles[14], [goodsDisplaySpaces[40], goodsDisplaySpaces[41]]),
  new GoodsDisplayLine(15, cityTiles[15], [goodsDisplaySpaces[42], goodsDisplaySpaces[43]]),
  new GoodsDisplayLine(16, cityTiles[16], [goodsDisplaySpaces[44], goodsDisplaySpaces[45]]),
  new GoodsDisplayLine(17, cityTiles[17], [goodsDisplaySpaces[46], goodsDisplaySpaces[47]]),
  new GoodsDisplayLine(18, cityTiles[18], [goodsDisplaySpaces[48], goodsDisplaySpaces[49]]),
  new GoodsDisplayLine(19, cityTiles[19], [goodsDisplaySpaces[50], goodsDisplaySpaces[51]])
] as const

export const goodsDisplayWhite = new GoodsDisplay([
  [goodsDisplayLines[0]],
  [goodsDisplayLines[1]],
  [goodsDisplayLines[2], goodsDisplayLines[12]],
  [goodsDisplayLines[3], goodsDisplayLines[13]],
  [goodsDisplayLines[4], goodsDisplayLines[14]],
  [goodsDisplayLines[5], goodsDisplayLines[15]]
])

export const goodsDisplayBlack = new GoodsDisplay([
  [goodsDisplayLines[6], goodsDisplayLines[16]],
  [goodsDisplayLines[7], goodsDisplayLines[17]],
  [goodsDisplayLines[8], goodsDisplayLines[18]],
  [goodsDisplayLines[9], goodsDisplayLines[19]],
  [goodsDisplayLines[10]],
  [goodsDisplayLines[11]]
])

export const clothBag = new ClothBag()

export const townMarkers = range(0, 7).map(id => new TownMarker(id))
