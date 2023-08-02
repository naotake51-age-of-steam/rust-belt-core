import { context, type Player } from 'game'
export class User {
  constructor (
    public readonly id: string,
    public readonly name: string
  ) {}

  public get player (): Player | null {
    const { g } = context()
    return g.players.find(_ => _.userId === this.id) ?? null
  }
}
