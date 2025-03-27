import { Type } from 'class-transformer'
import { PhaseId, Action, MapSpaceType } from 'enums'
import { GameBuilder, type Game, context, type Player } from 'game'
import { State } from 'game/State'
import { trackTiles, getMapSpace, cityTiles, Line, TownMarker, TownTrackTile, townMarkers } from 'objects'
import { determineNewLineOwner } from './BuildTrackPhase/DetermineNewLineOwner'
import { MoveGoodsPhase } from './MoveGoodsPhase'
import { Phase } from './Phase'

export class PlayerOrder extends State {
  constructor (
    public readonly playerId: number
  ) {
    super()
  }

  public get player (): Player {
    const { g } = context()

    return g.getPlayer(this.playerId)
  }
}

export class BuildTrackPhase extends Phase {
  public readonly id = PhaseId.BUILD_TRACK

  @Type(() => PlayerOrder)
  public readonly playerOrders: PlayerOrder[]

  constructor (
    playerOrders: PlayerOrder[],
    public readonly buildingTrackTileIds: number[],
    public readonly buildingCityTileIds: number[], // buildingTrackTileIdsに合わせて配列で持つようにした
    public readonly newLines: Array<{ trackTileId: number, number: number }> // 置き換え/方向転換しただけの線路は拡張にならないので、ターン終了後に所有権がなくなる
  ) {
    super()

    this.playerOrders = playerOrders
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const playerOrders = [...b.game.alivePlayers]
      .sort((a, b) => {
        if (a.action === Action.FIRST_BUILD) {
          return -1
        }
        if (b.action === Action.FIRST_BUILD) {
          return 1
        }
        return a.order - b.order
      })
      .map(_ => new PlayerOrder(_.id))

    b.setTurnPlayer(playerOrders[0].player)
    return b.setPhase(new BuildTrackPhase(playerOrders, [], [], []))
  }

  public isTurnPlayer (): boolean {
    const { p } = context()

    return p?.hasTurn ?? false
  }

  public get message (): string {
    const { g } = context()

    if (g.turnPlayer === null) throw new Error('turn player is null')

    if (g.turnPlayer.placableCityTile > 0) {
      return `${g.turnPlayer.name}は都市と線路を敷設してください。（最大${g.turnPlayer.placableTrackTileCount}本）`
    } else {
      return `${g.turnPlayer.name}は線路を敷設してください。（最大${g.turnPlayer.placableTrackTileCount}本）`
    }
  }

  /**
   * 拡張しなかった未完成線路（所有権を失う）
   */
  private get unextendedLines (): Line[] {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const unextendedLines: Line[] = []
    trackTiles.forEach(trackTile => {
      if (trackTile.isPlaced) {
        trackTile.lines.forEach(line => {
          if (
            line.isTip &&
            line.owner?.id === p.id &&
            this.newLines.find(_ => _.trackTileId === line.trackTileId && _.number === line.number) === undefined
          ) {
            unextendedLines.push(line)
            line.internalLinkedLines.forEach(_ => unextendedLines.push(_))
          }
        })
      }
    })

    return unextendedLines
  }

  public canBuildTrackTile (trackTileId: number, rotation: number, mapSpaceId: number): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (p.placableTrackTileCount <= this.buildingTrackTileIds.length) return false

    const trackTile = trackTiles[trackTileId]
    const mapSpace = getMapSpace(mapSpaceId)

    if (trackTile.isPlaced) throw new Error('Already placed track tile')

    return mapSpace.trackTile === null ? trackTile.canPlaceToMapSpace(mapSpace, rotation) : trackTile.canReplaceToMapSpace(mapSpace, rotation)
  }

  public actionBuildTrackTile (trackTileId: number, rotation: number, mapSpaceId: number): Game {
    const { g, p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canBuildTrackTile(trackTileId, rotation, mapSpaceId)) {
      throw new Error('Cannot build track tile')
    }

    const b = new GameBuilder(g)

    const trackTile = trackTiles[trackTileId]
    const mapSpace = getMapSpace(mapSpaceId)

    const buildingCost = mapSpace.trackTile === null ? trackTile.calculateCostOfPlaceToMapSpace(mapSpace) : trackTile.calculateCostOfReplaceToMapSpace(mapSpace)
    b.updatePlayer(
      p.produce(draft => {
        draft.money -= buildingCost
      })
    )

    let releaseTownMarker: TownMarker | null = null
    if (mapSpace.trackTile !== null) {
      b.releaseTrackTile(mapSpace.trackTile)
      const town = mapSpace.trackTile.town
      if (town instanceof TownMarker) {
        b.releaseTownMarkerToTrackTile(town)
        releaseTownMarker = town
      }
    }

    b.placeTrackTileToMapSpace(trackTile, mapSpace, rotation)
    if (mapSpace.type === MapSpaceType.TOWN && !(trackTile instanceof TownTrackTile)) {
      const placeTownMarker = releaseTownMarker ?? townMarkers.find(_ => !_.isPlaced)
      if (placeTownMarker === undefined) throw new Error('Cannot place town marker')

      b.placeTownMarkerToTrackTile(placeTownMarker, trackTile)
    }

    trackTile.lines.forEach(line => { determineNewLineOwner(line, mapSpace, rotation, b) })

    const phase = b.game.phase as BuildTrackPhase
    b.setPhase(
      phase.produce((draft) => {
        draft.buildingTrackTileIds = [...draft.buildingTrackTileIds, trackTileId]
      })
    )

    return b.build()
  }

  public canBuildCityTile (cityId: number, mapSpaceId: number): boolean {
    const { p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (p.placableCityTile <= this.buildingCityTileIds.length) return false

    const cityTile = cityTiles[cityId]
    const mapSpace = getMapSpace(mapSpaceId)

    // MEMO:: 都市配置の結果、他プレイヤーの線路が完成してもルール上OK

    if (cityTile.isPlaced) throw new Error('Already placed city tile')

    return cityTile.canPlaceToMapSpace(mapSpace)
  }

  public actionBuildCityTile (cityId: number, mapSpaceId: number): Game {
    const { g, p } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    if (!this.canBuildCityTile(cityId, mapSpaceId)) {
      throw new Error('Cannot build city tile')
    }

    const b = new GameBuilder(g)

    const cityTile = cityTiles[cityId]
    const mapSpace = getMapSpace(mapSpaceId)
    const phase = g.phase as BuildTrackPhase

    b.placeCityTileToMapSpace(cityTile, mapSpace)
    b.setPhase(
      phase.produce((draft) => {
        draft.buildingCityTileIds = [...draft.buildingCityTileIds, cityId]
      })
    )

    if (mapSpace.trackTile !== null) {
      b.releaseTrackTile(mapSpace.trackTile)
      const town = mapSpace.trackTile.town
      if (town instanceof TownMarker) {
        b.releaseTownMarkerToTrackTile(town)
      }
    }

    // 都市配置によってい所有者のいない線路が完成したら、その線路の所有権を取得する
    for (let direction = 0; direction < 6; direction++) {
      const linkedObject = mapSpace.getLinkedObject(direction)
      if (linkedObject instanceof Line && linkedObject.owner === null && linkedObject.isTip /** TODO:: 完成しない場合は所有権そのままでよい？ */) {
        b.setLineOwner(linkedObject, p)
        linkedObject.internalLinkedLines.forEach(_ => b.setLineOwner(_, p))
      }
    }

    return b.build()
  }

  public actionCompleteBuild (): Game {
    const { p, g } = context()
    if (p === null) throw new Error('user is not in the game')
    if (!p.hasTurn) throw new Error('user is not turn player')

    const b = new GameBuilder(g)

    // 拡張しなかった線路の所有権を失う
    this.unextendedLines.forEach(line => {
      b.setLineOwner(line, null)
    })

    const nextPlayer = this.getNextPlayer(p)
    if (nextPlayer !== null) {
      b.setTurnPlayer(nextPlayer)
      b.setPhase(
        new BuildTrackPhase(this.playerOrders, [], [], []))
    } else {
      MoveGoodsPhase.prepare(b)
    }

    return b.build()
  }

  private getNextPlayer (player: Player): Player | null {
    const nextIndex = this.playerOrders.findIndex(_ => _.playerId === player.id) + 1
    if (this.playerOrders.length <= nextIndex) return null

    return this.playerOrders[nextIndex].player
  }
}
