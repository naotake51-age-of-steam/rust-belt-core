import { PhaseId } from 'enums'
import { type Game } from 'game'
import { type Phase } from './Phase'

export class IssueSharesPhase implements Phase {
  public readonly id = PhaseId.ISSUE_SHARES

  public get message (): string {
    throw new Error('Not implemented')
  }

  /**
   * 発行可能な最小株式数
   */
  public get minIssuableShares (): number {
    throw new Error('Not implemented')
  }

  /**
   * 発行可能な最大株式数
   */
  public get maxIssuableShares (): number {
    throw new Error('Not implemented')
  }

  public static prepare (): IssueSharesPhase {
    throw new Error('Not implemented')
  }

  public canIssueShares (): boolean {
    // 発行可能な残り株式数が0の場合にfalse
    throw new Error('Not implemented')
  }

  public actionIssueShares (count: number): Game {
    throw new Error('Not implemented')
  }

  public actionPassShares (): Game {
    // 発行可能な残り株式数が0のユーザーにも手番を回す。ユーザーはパスをセ選択する。
    throw new Error('Not implemented')
  }
}
