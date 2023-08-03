export enum Action {
  FIRST_MOVE = 'FIRST_MOVE',
  FIRST_BUILD = 'FIRST_BUILD',
  ENGINEER = 'ENGINEER',
  LOCOMOTIVE = 'LOCOMOTIVE',
  URBANIZATION = 'URBANIZATION',
  PRODUCTION = 'PRODUCTION',
  TURN_ORDER_PASS = 'TURN_ORDER_PASS',
}

export const allActions = [
  Action.FIRST_MOVE,
  Action.FIRST_BUILD,
  Action.ENGINEER,
  Action.LOCOMOTIVE,
  Action.URBANIZATION,
  Action.PRODUCTION,
  Action.TURN_ORDER_PASS
]

export function getActionName (): string {
  throw new Error('Not implemented')
}
