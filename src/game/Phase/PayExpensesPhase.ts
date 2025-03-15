import { Type } from 'class-transformer'
import { PhaseId } from 'enums'
import { type Game, context, IncomeReductionPhase } from 'game'
import { GameBuilder } from 'game/GameBuilder'
import { type Player } from 'game/Player'
import { Phase, type HasDelayExecute } from './Phase'

class Payment {
  constructor (
    public readonly playerId: number,
    public readonly payment: number,
    public readonly reduceIncome: number,
    public readonly shortage: number
  ) {
  }

  public get player (): Player {
    const { g } = context()

    const player = g.players.find(_ => _.id === this.playerId)
    if (player === undefined) {
      throw new Error('player not found')
    }

    return player
  }
}

export class PayExpensesPhase extends Phase implements HasDelayExecute {
  public readonly id = PhaseId.PAY_EXPENSES

  @Type(() => Payment)
  public readonly playerPayments: Payment[]

  public constructor (playerPayments: Payment[]) {
    super()

    this.playerPayments = playerPayments
  }

  public static prepare (b: GameBuilder): GameBuilder {
    const newPlayers: Player[] = []
    const playerPayments: Payment[] = []

    b.game.players.forEach(_ => {
      const payment = _.issuedShares + _.engine
      const [money, reduceIncome] = _.money < payment ? [0, payment - _.money] : [_.money - payment, 0]
      const [income, shortage] = _.income < reduceIncome ? [0, reduceIncome - _.income] : [_.income - reduceIncome, 0]

      newPlayers.push(_.produce((draft) => {
        draft.money = money
        draft.income = income
        if (draft.alive) {
          draft.alive = shortage === 0
        }
      }))

      playerPayments.push(new Payment(_.id, payment, reduceIncome, shortage))
    })

    b.setPlayers(newPlayers)

    b.setPhase(new PayExpensesPhase(playerPayments))

    return b
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get message (): string {
    return 'プレイヤーは支払いを行います。\n(支払いが足りない場合は収入が減ります。収入がマイナスになる場合はゲームから脱落します。)'
  }

  public executeDelay (): Game {
    const { g } = context()
    const b = new GameBuilder(g)

    IncomeReductionPhase.prepare(b)

    return b.build()
  }
}
