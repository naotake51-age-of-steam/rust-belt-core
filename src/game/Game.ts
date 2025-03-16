import 'reflect-metadata'
import { Type, Transform, plainToInstance, Exclude } from 'class-transformer'
import { PhaseId } from 'enums'
import { type Phase, Player, GoodsCubeState, TrackTileState, CityTileState, TownMarkerState, context } from 'game'
import {
  WaitingStartPhase,
  IssueSharesPhase,
  DeterminePlayerOrderPhase,
  SelectActionsPhase,
  BuildTrackPhase,
  MoveGoodsPhase,
  CollectIncomePhase,
  PayExpensesPhase,
  IncomeReductionPhase,
  ProductionPhase,
  GoodsGrowthPhase,
  AdvanceTurnMarkerPhase,
  EndGamePhase
} from 'game'
import { match } from 'ts-pattern'
import { createUniqueIndex, createIndex } from 'utility'
import { State } from './State'

export class Game extends State {
  @Exclude()
  private __trackTileStatesIndexByMapSpace?: Map<number, TrackTileState>

  @Exclude()
  private __cityTileStatesIndexByMapSpace?: Map<number, CityTileState>

  @Exclude()
  private __goodsCubeStatesIndexByMapSpace?: Map<number, GoodsCubeState[]>

  @Exclude()
  private __goodsCubeStatesIndexByGoodsDisplaySpace?: Map<number, GoodsCubeState>

  @Exclude()
  private __townMakerStatesIndexByTrackTile?: Map<number, TownMarkerState>

  @Type(() => Player)
  public readonly players: Player[]

  @Type(() => TrackTileState)
  public readonly trackTileStates: TrackTileState[]

  @Type(() => CityTileState)
  public readonly cityTileStates: CityTileState[]

  @Type(() => GoodsCubeState)
  public readonly goodsCubeStates: GoodsCubeState[]

  @Type(() => TownMarkerState)
  public readonly townMakerStates: TownMarkerState[]

  @Transform(({ value }) => {
    return plainToInstance(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      match(PhaseId[value.id])
        .with(PhaseId.WAITING_START, () => WaitingStartPhase)
        .with(PhaseId.ISSUE_SHARES, () => IssueSharesPhase)
        .with(PhaseId.DETERMINE_PLAYER_ORDER, () => DeterminePlayerOrderPhase)
        .with(PhaseId.SELECT_ACTIONS, () => SelectActionsPhase)
        .with(PhaseId.BUILD_TRACK, () => BuildTrackPhase)
        .with(PhaseId.MOVE_GOODS, () => MoveGoodsPhase)
        .with(PhaseId.COLLECT_INCOME, () => CollectIncomePhase)
        .with(PhaseId.PAY_EXPENSES, () => PayExpensesPhase)
        .with(PhaseId.INCOME_REDUCTION, () => IncomeReductionPhase)
        .with(PhaseId.PRODUCTION, () => ProductionPhase)
        .with(PhaseId.GOODS_GROWTH, () => GoodsGrowthPhase)
        .with(PhaseId.ADVANCE_TURN_MARKER, () => AdvanceTurnMarkerPhase)
        .with(PhaseId.END_GAME, () => EndGamePhase)
        .exhaustive()
      , value)
  })
  public readonly phase: Phase

  constructor (
    players: Player[],
    public readonly round: number,
    phase: Phase,
    public readonly turnPlayerId: number | null,
    trackTileStates: TrackTileState[],
    cityTileStates: CityTileState[],
    goodsCubeStates: GoodsCubeState[],
    townMakerStates: TownMarkerState[]
  ) {
    super()

    this.players = players
    this.phase = phase
    this.trackTileStates = trackTileStates
    this.cityTileStates = cityTileStates
    this.goodsCubeStates = goodsCubeStates
    this.townMakerStates = townMakerStates
  }

  get trackTileStatesIndexByMapSpace (): Map<number, TrackTileState> {
    // eslint-disable-next-line no-return-assign
    return this.__trackTileStatesIndexByMapSpace ??= createUniqueIndex(this.trackTileStates, 'mapSpaceId')
  }

  get cityTileStatesIndexByMapSpace (): Map<number, CityTileState> {
    // eslint-disable-next-line no-return-assign
    return this.__cityTileStatesIndexByMapSpace ??= createUniqueIndex(this.cityTileStates, 'mapSpaceId')
  }

  get goodsCubeStatesIndexByMapSpace (): Map<number, GoodsCubeState[]> {
    // eslint-disable-next-line no-return-assign
    return this.__goodsCubeStatesIndexByMapSpace ??= createIndex(this.goodsCubeStates, 'mapSpaceId')
  }

  get goodsCubeStatesIndexByGoodsDisplaySpace (): Map<number, GoodsCubeState> {
    // eslint-disable-next-line no-return-assign
    return this.__goodsCubeStatesIndexByGoodsDisplaySpace ??= createUniqueIndex(this.goodsCubeStates, 'goodsDisplaySpaceId')
  }

  get townMakerStatesIndexByTrackTile (): Map<number, TownMarkerState> {
    // eslint-disable-next-line no-return-assign
    return this.__townMakerStatesIndexByTrackTile ??= createUniqueIndex(this.townMakerStates, 'trackTileId')
  }

  get alivePlayers (): Player[] {
    return this.players.filter(_ => _.alive)
  }

  public get turnPlayer (): Player | null {
    if (this.turnPlayerId === null) return null

    return this.getPlayer(this.turnPlayerId)
  }

  public get currentPlayer (): Player | null {
    const { p } = context()

    return p
  }

  public get message (): string {
    return this.phase.message
  }

  public get lastRound (): number {
    const players = this.players.length

    if (players === 6) {
      return 5
    } else if (players === 5) {
      return 6
    } else if (players === 4) {
      return 7
    } else {
      return 9
    }
  }

  public canUndo (): boolean {
    throw new Error('Not implemented')
  }

  public getPlayer (id: number): Player {
    const player = this.players.find(_ => _.id === id)

    if (player === undefined) throw new Error('Not found player')

    return player
  }

  public actionUndo (): Game {
    throw new Error('Not implemented')
  }

  public flesh (): Game {
    this.__trackTileStatesIndexByMapSpace = undefined
    this.__cityTileStatesIndexByMapSpace = undefined
    this.__goodsCubeStatesIndexByMapSpace = undefined
    this.__goodsCubeStatesIndexByGoodsDisplaySpace = undefined
    this.__townMakerStatesIndexByTrackTile = undefined

    return this
  }
}
