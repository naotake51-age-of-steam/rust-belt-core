import { Type } from 'class-transformer'
import { PhaseId, Action, MapSpaceType } from 'enums'
import { GameBuilder, type Game, context, type Player, SettlementPhase } from 'game'
import { getMapSpace, type GoodsCube, goodsCubes, type MapSpace, CityTile, TownMarker, MAX_ENGINE, Town } from 'objects'
import { Phase } from './Phase'

class Moving {
  constructor (
    public readonly spaceMapId: number,
    public readonly playerId: number | null
  ) {
  }

  public get spaceMap (): MapSpace {
    return getMapSpace(this.spaceMapId)
  }

  public get player (): Player | null {
    const { g } = context()

    if (this.playerId === null) return null

    return g.getPlayer(this.playerId)
  }
}

export class MoveGoodsPhase extends Phase {
  public readonly id = PhaseId.MOVE_GOODS

  @Type(() => Moving)
  public readonly movingList: Moving[]

  constructor (
    public readonly selectedGoodsCubeId: number | null,
    movingList: Moving[],
    public readonly movingCounter: number, // 1 or 2
    public readonly incrementedLocomotivePlayerIds: number[] // プレイヤーは二回の輸送のうち一回だけ機関車を進められる
  ) {
    super()

    this.movingList = movingList
  }

  public static prepare (b: GameBuilder): GameBuilder {
    return b
      .persist()
      .setTurnPlayer(MoveGoodsPhase.orderedPlayers[0])
      .setPhase(new MoveGoodsPhase(null, [], 1, []))
  }

  static get orderedPlayers (): Player[] {
    const { g } = context()

    return g.alivePlayers.sort((a, b) => {
      if (a.action === Action.FIRST_BUILD) {
        return -1
      }
      if (b.action === Action.FIRST_BUILD) {
        return 1
      }
      return a.order - b.order
    })
  }

  public isTurnPlayer (): boolean {
    const { p } = context()

    return p?.hasTurn ?? false
  }

  public get message (): string {
    const { g } = context()

    if (g.turnPlayer === null) throw new Error('turn player is null')

    return `${g.turnPlayer.name}は商品輸送またはエンジン+1を行ってください。\n（商品輸送をする場合は、マップ上の商品を選択して輸送経路を順番に選択）`
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
      return this.movingList[this.movingList.length - 1].spaceMap
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

    b.setPhase(
      this.produce((draft) => {
        draft.selectedGoodsCubeId = goodsCubeId
      })
    )

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
      if (trackTile !== null) {
        if (trackTile.getLineByDirection(direction) === null) return false
      }
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

    b.setPhase(
      this.produce((draft) => {
        draft.movingList.push(new Moving(nextMapSpace.id, linkedLine.owner?.id ?? null))
      })
    )

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
        if (!draft.alive) return

        draft.income += this.movingList.filter(moving => moving.playerId === _.id).length
      }))
    )

    if (this.selectedGoodsCube === null) throw new Error('logic error')

    b.releaseGoodsCube(this.selectedGoodsCube)

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

    b.producePhase<MoveGoodsPhase>((draft) => {
      draft.incrementedLocomotivePlayerIds = [...draft.incrementedLocomotivePlayerIds, p.id]
    })

    return this.next(b).build()
  }

  private getNextPlayer (player: Player): Player | null {
    const orderedPlayers = MoveGoodsPhase.orderedPlayers
    const nextIndex = orderedPlayers.findIndex(_ => _.id === player.id) + 1
    if (orderedPlayers.length <= nextIndex) return null

    return orderedPlayers[nextIndex]
  }

  private next (b: GameBuilder): GameBuilder {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const nextPlayer = this.getNextPlayer(p)
    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
      b.producePhase<MoveGoodsPhase>((draft) => {
        draft.selectedGoodsCubeId = null
        draft.movingList = []
      })
    } else {
      if (this.movingCounter === 1) {
        b.setTurnPlayer(MoveGoodsPhase.orderedPlayers[0])
        b.producePhase<MoveGoodsPhase>((draft) => {
          draft.selectedGoodsCubeId = null
          draft.movingList = []
          draft.movingCounter = 2
        })
      } else {
        SettlementPhase.prepare(b)
      }
    }

    return b
  }
}
