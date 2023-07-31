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

let gameIns: Game | null = null
let userIns: User | null = null

export function game (g: Game | null = null): Game {
  if (g !== null) {
    gameIns = g
  }

  if (gameIns == null) throw new Error('Game is not initialized')

  return gameIns
}

export function user (u: User | null = null): User {
  if (u !== null) {
    userIns = u
  }

  if (userIns == null) throw new Error('User is not initialized')

  return userIns
}

export function context (): Readonly<Context> {
  const g = game()
  const u = user()
  const p = u.player

  return { g, u, p }
}
