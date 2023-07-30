export const range = (from: number, to: number): number[] => {
  const list = []
  for (let i = from; i <= to; i++) {
    list.push(i)
  }
  return list
}
