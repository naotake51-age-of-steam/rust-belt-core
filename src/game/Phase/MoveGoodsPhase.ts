import { PhaseId, Action, MapSpaceType } from 'enums'
import { GameBuilder, type Game, context, type Player, MAX_ENGINE } from 'game'
import { State } from 'game/State'
import { getMapSpace, type GoodsCube, goodsCubes, type MapSpace, CityTile, TownMarker } from 'objects'
import { Town } from '../../objects/TrackTile/Town'
import { CollectIncomePhase } from './CollectIncomePhase'
import { type Phase } from './Phase'

export class MoveGoodsPhase extends State implements Phase {
  public readonly id = PhaseId.MOVE_GOODS

  constructor (
    public readonly selectedGoodsCubeId: number | null,
    public readonly movingList: Array<{ spaceMapId: number, playerId: number | null }>,
    public readonly movingCounter: number, // 1 or 2
    public readonly incrementedLocomotivePlayerIds: number[] // プレイヤーは二回の輸送のうち一回だけ機関車を進められる
  ) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const players = MoveGoodsPhase.getOrderedPlayers()
    b.setTurnPlayer(players[0])
    return b.setPhase(new MoveGoodsPhase(null, [], 1, []))
  }

  public static getOrderedPlayers (): Player[] {
    const { g } = context()
    return [...g.players].sort((a, b) => {
      if (a.action === Action.FIRST_MOVE) {
        return -1
      }
      if (b.action === Action.FIRST_MOVE) {
        return 1
      }
      return a.order - b.order
    })
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public get selectedGoodsCube (): GoodsCube | null {
    if (this.selectedGoodsCubeId === null) return null

    return goodsCubes[this.selectedGoodsCubeId]
  }

  public get currentMapSpace (): MapSpace | null {
    if (this.selectedGoodsCube === null) return null

    if (this.movingList.length === 0) {
      return this.selectedGoodsCube.mapSpace
    } else {
      return getMapSpace(this.movingList[this.movingList.length - 1].spaceMapId)
    }
  }

  public canSelectGoodsCube (goodsCubeId: number): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    return this.movingList.length === 0 &&
    this.selectedGoodsCubeId !== goodsCubeId &&
    goodsCubes[goodsCubeId].mapSpace !== null
  }

  public actionSelectGoodsCube (goodsCubeId: number): Game {
    if (!this.canSelectGoodsCube(goodsCubeId)) throw new Error('cannot select goods cube')

    const { g } = context()
    const b = new GameBuilder(g)

    b.setPhase(new MoveGoodsPhase(
      goodsCubeId,
      this.movingList,
      this.movingCounter,
      this.incrementedLocomotivePlayerIds
    ))

    return b.build()
  }

  public canMoveGoodsCube (direction: number): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (this.selectedGoodsCubeId === null) return false

    if (this.canCompleteMoving()) return false

    const currentMapSpace = this.currentMapSpace
    if (currentMapSpace === null) return false

    if (this.movingList.length >= p.engine) return false

    if (currentMapSpace.type === MapSpaceType.TOWN) {
      const trackTile = currentMapSpace.trackTile
      if (trackTile === null) throw new Error('logic error')

      if (trackTile.getLineByDirection(direction) === null) return false
    }

    // 都市、町以外には移動できない
    const linkedTerminalObject = currentMapSpace.getLinkedTerminalObject(direction)
    const isValidType = linkedTerminalObject instanceof CityTile || linkedTerminalObject instanceof Town || linkedTerminalObject instanceof TownMarker
    if (!isValidType) return false

    // すでに移動済みの場所には移動できない
    const nextMapSpace = linkedTerminalObject.mapSpace
    if (this.selectedGoodsCube?.mapSpace?.id === nextMapSpace?.id) return false
    if (this.movingList.find(_ => _.spaceMapId === nextMapSpace?.id) !== undefined) return false

    return true
  }

  public actionMoveGoodsCube (direction: number): Game {
    if (!this.canMoveGoodsCube(direction)) throw new Error('cannot move goods cube')

    const { g } = context()
    const b = new GameBuilder(g)

    if (this.selectedGoodsCube === null) throw new Error('logic error')

    const currentMapSpace = this.currentMapSpace
    if (currentMapSpace === null) throw new Error('logic error')

    const linkedTerminalObject = currentMapSpace.getLinkedTerminalObject(direction)
    const isValidType = linkedTerminalObject instanceof CityTile || linkedTerminalObject instanceof Town || linkedTerminalObject instanceof TownMarker
    if (!isValidType) throw new Error('logic error')

    const nextMapSpace = linkedTerminalObject.mapSpace
    if (nextMapSpace === null) throw new Error('logic error')

    const linkedLine = currentMapSpace.getLinkedLine(direction)
    if (linkedLine === null) throw new Error('logic error') // マップによっては線路を挟まない場合がある
    b.setPhase(new MoveGoodsPhase(
      this.selectedGoodsCubeId,
      [...this.movingList, { spaceMapId: nextMapSpace.id, playerId: linkedLine.owner?.id ?? null }],
      this.movingCounter,
      this.incrementedLocomotivePlayerIds
    ))

    return b.build()
  }

  public canCompleteMoving (): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (this.selectedGoodsCube === null) return false
    if (this.movingList.length === 0) return false

    const lastMoving = this.movingList[this.movingList.length - 1]

    const lastMovingMapSpace = getMapSpace(lastMoving.spaceMapId)

    const cityTile = lastMovingMapSpace.cityTile
    if (cityTile === null) return false

    return cityTile.isAcceptGoodsCube(this.selectedGoodsCube)
  }

  public actionCompleteMoving (): Game {
    const { g, p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const b = new GameBuilder(g)

    if (!this.canCompleteMoving()) throw new Error('cannot complete moving')

    b.setPlayers(g.players.map(
      _ => _.produce(draft => {
        draft.income += this.movingList.filter(moving => moving.playerId === _.id).length
      }))
    )

    return this.next(b).build()
  }

  public actionPass (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const b = new GameBuilder(g)

    return this.next(b).build()
  }

  public canIncrementLocomotive (): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (this.incrementedLocomotivePlayerIds.includes(p.id)) return false

    if (MAX_ENGINE <= p.engine) return false

    return true
  }

  public actionIncrementLocomotive (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canIncrementLocomotive()) throw new Error('can not increment locomotive')

    const b = new GameBuilder(g)

    b.updatePlayer(p.produce(draft => {
      draft.engine += 1
    }))

    b.setPhase(new MoveGoodsPhase(
      this.selectedGoodsCubeId,
      this.movingList,
      this.movingCounter,
      [...this.incrementedLocomotivePlayerIds, p.id]
    ))

    return this.next(b).build()
  }

  private getNextPlayer (player: Player): Player | null {
    const players = MoveGoodsPhase.getOrderedPlayers()

    const nextIndex = players.findIndex(_ => _.id === player.id) + 1
    if (players.length <= nextIndex) return null

    return players[nextIndex]
  }

  private next (b: GameBuilder): GameBuilder {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const nextPlayer = this.getNextPlayer(p)
    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
      b.setPhase(new MoveGoodsPhase(null, [], this.movingCounter, this.incrementedLocomotivePlayerIds))
    } else {
      if (this.movingCounter === 1) {
        const players = MoveGoodsPhase.getOrderedPlayers()
        b.setTurnPlayer(players[0])
        b.setPhase(new MoveGoodsPhase(null, [], 2, this.incrementedLocomotivePlayerIds))
      } else {
        CollectIncomePhase.prepare(b)
      }
    }

    return b
  }
}
