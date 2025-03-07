import { PhaseId } from 'enums'
import { type PlayerColor } from 'enums/PlayerColor'
import { GameError } from 'errors'
import { type Game, type User, GameBuilder, context, type Phase, IssueSharesPhase, Player } from 'game'
import { State } from 'game/State'
import { cityTiles, goodsDisplaySpaces, clothBag } from 'objects'
import { range, shuffleArray } from 'utility'

const MIN_PLAYERS = 3
const MAX_PLAYERS = 6

const INITIALIZE_ISSUE_SHARES = 2
const INITIALIZE_MONEY = 10
const INITIALIZE_INCOME = 0
const INITIALIZE_ENGINE = 1

export class WaitingStartPhase extends State implements Phase {
  public readonly id = PhaseId.WAITING_START

  constructor (
    public readonly joinedUsers: User[]
  ) {
    super()
  }

  public static prepare (b: GameBuilder): GameBuilder {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public canJoinUser (): boolean {
    const { g, p } = context()

    if (MAX_PLAYERS <= g.players.length) {
      return false
    }

    return p === null
  }

  public actionJoinUser (color: PlayerColor): Game {
    const { g, u } = context()
    const b = new GameBuilder(g)

    if (!this.canJoinUser()) {
      throw new GameError('Cannot join user')
    }

    return b.setPlayers([
      ...g.players,
      new Player(
        g.players.length,
        u.id,
        u.name,
        color,
        null,
        0,
        INITIALIZE_ISSUE_SHARES,
        INITIALIZE_MONEY,
        INITIALIZE_INCOME,
        INITIALIZE_ENGINE
      )]).build()
  }

  public canRemoveUser (): boolean {
    const { p } = context()

    return p !== null
  }

  public actionRemoveUser (): Game {
    const { g, p } = context()
    const b = new GameBuilder(g)

    if (!this.canRemoveUser()) {
      throw new GameError('Cannot remove user')
    }

    return b.setPlayers(g.players.filter(_ => _.id !== p?.id)).build()
  }

  public canStartGame (): boolean {
    const { g, p } = context()

    if (p === null) {
      // 参加しているユーザーでない場合はゲーム開始できない
      return false
    }

    return MIN_PLAYERS <= g.players.length && g.players.length <= MAX_PLAYERS
  }

  public actionStartGame (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    if (!this.canStartGame()) {
      throw new GameError('Cannot start game')
    }

    const orders = shuffleArray(range(1, g.players.length))

    b.setPlayers(
      g.players.map((_, i) => {
        return _.produce(draft => {
          draft.order = orders[i]
        })
      })
    )

    b.setPhase(
      new IssueSharesPhase()
    )

    const shuffledGoodsCubes = shuffleArray(clothBag.goodsCubes)

    // GoodsDisplayにGoodsCubeを配置する
    goodsDisplaySpaces.forEach((_) => {
      const goodsCube = shuffledGoodsCubes.shift()
      if (goodsCube === undefined) throw new Error('Unexpected error')

      b.placeGoodsCubeToGoodsDisplaySpace(goodsCube, _)
    })

    // CityTileにGoodsCubeを配置する
    cityTiles.forEach((_) => {
      if (_.initialize === null) {
        return
      }
      const mapSpace = _.mapSpace
      if (mapSpace === null) throw new Error('Unexpected error')

      for (let i = 0; i < _.initialize.goodsCubesQuantity; i++) {
        const goodsCube = shuffledGoodsCubes.shift()
        if (goodsCube === undefined) throw new Error('Unexpected error')

        b.placeGoodsCubeToMapSpace(goodsCube, mapSpace)
      }
    })

    return b.build()
  }
}
