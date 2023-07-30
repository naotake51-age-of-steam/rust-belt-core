import { PhaseId } from 'enums'
import { type Game } from 'game'
import { type Line } from 'objects'
import { type Phase } from './Phase'

export class BuildTrackPhase implements Phase {
  public readonly id = PhaseId.BUILD_TRACK

  constructor (
    public readonly buildingTrackTileIds: number[],
    public readonly buildingCityTileId: number | null
  ) {
  }

  public static prepare (): BuildTrackPhase {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  /**
   * 拡張しなかった未完成線路（所有権を失う）
   */
  public get unextendedLines (): Line[] {
    throw new Error('Not implemented')
  }

  public canBuildTrackTile (trackTileId: number, rotation: number, mapSpaceId: number): boolean {
    throw new Error('Not implemented')
  }

  public actionBuildTrackTile (trackTileId: number, rotation: number, mapSpaceId: number): Game {
    throw new Error('Not implemented')
  }

  public canBuildCityTile (cityId: number, mapSpaceId: number): boolean {
    throw new Error('Not implemented')
  }

  public actionBuildCityTile (cityId: number, mapSpaceId: number): boolean {
    throw new Error('Not implemented')
  }

  public actionCompleteBuild (): Game {
    throw new Error('Not implemented')
  }
}
