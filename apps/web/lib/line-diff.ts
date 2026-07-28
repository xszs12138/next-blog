export type DiffLineType = "same" | "added" | "removed"

export type DiffLine = {
  text: string
  type: DiffLineType
  placeholder?: boolean
}

export type LineDiff = {
  before: DiffLine[]
  after: DiffLine[]
}

export function diffLines(before: string[], after: string[]): LineDiff {
  const beforeLength = before.length
  const afterLength = after.length
  const matrix = Array.from({ length: beforeLength + 1 }, () =>
    Array<number>(afterLength + 1).fill(0)
  )

  for (let beforeIndex = 1; beforeIndex <= beforeLength; beforeIndex++) {
    for (let afterIndex = 1; afterIndex <= afterLength; afterIndex++) {
      if (before[beforeIndex - 1] === after[afterIndex - 1]) {
        matrix[beforeIndex]![afterIndex] =
          matrix[beforeIndex - 1]![afterIndex - 1]! + 1
      } else {
        matrix[beforeIndex]![afterIndex] = Math.max(
          matrix[beforeIndex - 1]![afterIndex]!,
          matrix[beforeIndex]![afterIndex - 1]!
        )
      }
    }
  }

  const result: LineDiff = { before: [], after: [] }
  let beforeIndex = beforeLength
  let afterIndex = afterLength

  while (beforeIndex > 0 || afterIndex > 0) {
    if (
      beforeIndex > 0 &&
      afterIndex > 0 &&
      before[beforeIndex - 1] === after[afterIndex - 1]
    ) {
      result.before.unshift({ text: before[beforeIndex - 1]!, type: "same" })
      result.after.unshift({ text: after[afterIndex - 1]!, type: "same" })
      beforeIndex--
      afterIndex--
    } else if (
      afterIndex > 0 &&
      (beforeIndex === 0 ||
        matrix[beforeIndex]![afterIndex - 1]! >= matrix[beforeIndex - 1]![afterIndex]!)
    ) {
      result.before.unshift({ text: "", type: "same", placeholder: true })
      result.after.unshift({ text: after[afterIndex - 1]!, type: "added" })
      afterIndex--
    } else {
      result.before.unshift({ text: before[beforeIndex - 1]!, type: "removed" })
      result.after.unshift({ text: "", type: "same", placeholder: true })
      beforeIndex--
    }
  }

  return result
}

export function diffText(before: string, after: string) {
  return diffLines(before.split("\n"), after.split("\n"))
}
