import { type Game } from './Game'
import { type Player } from './Player'
import { type User } from './User'

export * from './Phase'
export * from './Game'
export * from './Player'
export * from './ObjectState'
export * from './User'
export * from './GameBuilder'

interface Context {
  g: Game
  u: User
  p: Player | null
}

let c: Context | null = null

export function setContext (g: Game, u: User): Readonly<Context> {
  c = { g, u, p: g.players.find(_ => _.userId === u.id) ?? null }
  return c
}

export function context (): Readonly<Context> {
  if (c === null) throw new Error('Context is not initialized')
  return c
}
