import { PhaseId } from 'enums'
import { GameError } from 'errors'
import { type Game, type User, GameBuilder, Player, context, type Phase, IssueSharesPhase } from 'game'
import { State } from 'game/State'
import { cityTiles, goodsDisplaySpaces, clothBag } from 'objects'
import { shuffleArray } from 'utility'

const MIN_PLAYERS = 3
const MAX_PLAYERS = 6
const INITIALIZE_ISSUE_SHARES = 2
const INITIALIZE_MONEY = 10

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
    const { g, u } = context()

    if (MAX_PLAYERS <= g.users.length) {
      return false
    }

    return g.users.findIndex(_ => _.id === u.id) === -1
  }

  public actionJoinUser (): Game {
    const { g, u } = context()
    const b = new GameBuilder(g)

    if (!this.canJoinUser()) {
      throw new GameError('Cannot join user')
    }

    return b.setUsers([...g.users, u]).build()
  }

  public canRemoveUser (): boolean {
    const { g, u } = context()

    return g.users.findIndex(_ => _.id === u.id) !== -1
  }

  public actionRemoveUser (): Game {
    const { g, u } = context()
    const b = new GameBuilder(g)

    if (!this.canRemoveUser()) {
      throw new GameError('Cannot remove user')
    }

    return b.setUsers(g.users.filter(_ => _.id !== u.id)).build()
  }

  public canStartGame (): boolean {
    const { g, u } = context()

    if (g.users.findIndex(_ => _.id === u.id) === -1) {
      // 参加しているユーザーでない場合はゲーム開始できない
      return false
    }

    return MIN_PLAYERS <= g.users.length && g.users.length <= MAX_PLAYERS
  }

  public actionStartGame (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    if (!this.canStartGame()) {
      throw new GameError('Cannot start game')
    }

    b.setPlayers(
      shuffleArray(g.users)
        .map((_, i) => new Player(i, _.id, null, i + 1, INITIALIZE_ISSUE_SHARES, INITIALIZE_MONEY, 0, 1))
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
