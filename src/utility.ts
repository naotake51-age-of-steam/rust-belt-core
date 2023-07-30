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
