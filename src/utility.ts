export const range = (from: number, to: number): number[] => {
  const list = []
  for (let i = from; i <= to; i++) {
    list.push(i)
  }
  return list
}

export function shuffleArray <T> (array: T[]): T[] {
  const shuffledArray = [...array]

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // 要素を交換
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]]
  }

  return shuffledArray
}

export function random (from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1)) + from
}

export function createUniqueIndex <T, K extends keyof T> (items: T[], key: K): Map<NonNullable<T[K]>, T> {
  const index = new Map<NonNullable<T[K]>, T>()
  items.forEach((item) => {
    const value = item[key]
    if (value === null || value === undefined) return

    if (index.has(value)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`duplicate value: ${value}`)
    }
    index.set(value, item)
  })
  return index
}

export function createIndex <T, K extends keyof T> (items: T[], key: K): Map<NonNullable<T[K]>, T[]> {
  const index = new Map<NonNullable<T[K]>, T[]>()
  items.forEach((item) => {
    const value = item[key]
    if (value === null || value === undefined) return

    const newItems = index.get(value) ?? []
    newItems.push(item)

    index.set(value, newItems)
  })
  return index
}
