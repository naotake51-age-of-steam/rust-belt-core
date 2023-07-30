import { PhaseId } from 'enums'
import { type Player, type Game } from 'game'
import { type Phase } from './Phase'

enum BidType {
  BIDDING = 'BIDDING',
  DROPOUT = 'DROPOUT',
  SOFT_PASS = 'SOFT_PASS'
}

interface Bid { playerId: number, type: BidType, money: number | null} // BIDDINGの場合にmoneyを設定する

interface Result { playerId: number, paymentAmount: number, order: number }

export class DeterminePlayerOrderPhase implements Phase {
  public readonly id = PhaseId.DETERMINE_PLAYER_ORDER
  constructor (
    public readonly bids: Bid[]
  ) { }

  public static prepare (): DeterminePlayerOrderPhase {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public canBids (): boolean {
    // 手持ち金額によってはビッドできない場合がある
    throw new Error('Not implemented')
  }

  public actionBids (): Game {
    throw new Error('Not implemented')
  }

  public canPass (): boolean {
    throw new Error('Not implemented')
  }

  public actionPass (): Game {
    throw new Error('Not implemented')
  }

  public actionDropout (): Game {
    throw new Error('Not implemented')
  }

  private getNextPlayer (): Player | null {
    // ビッドできないプレイヤーをお飛ばさず、降りるアクションをユーザーに行わせる。降りたプレイヤーは飛ばす。
    // 次のプレイヤーがいない場合はnullを返す
    throw new Error('Not implemented')
  }

  private getPhaseResults (): Result[] {
    // フェーズが終了していない場合は例外を投げる
    throw new Error('Not implemented')
  }

  private finish (): Game {
    throw new Error('Not implemented')
  }
}
