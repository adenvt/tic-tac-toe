export const PLAYERS = ['✕', '○']

export const WIN_PATTERNS = [
  /* eslint-disable array-element-newline, array-bracket-newline */
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
  /* eslint-enable array-element-newline, array-bracket-newline */
]

export function findOpponent (current: string): string {
  return PLAYERS[0] === current ? PLAYERS[1] : PLAYERS[0]
}

export function findWinPattern (boards: string[]): number[] | undefined {
  for (const pattern of WIN_PATTERNS) {
    const [
      a,
      b,
      c,
    ] = pattern

    if (boards[a] && boards[a] === boards[b] && boards[b] === boards[c])
      return pattern
  }
}

export function getEmptySpot (boards: string[]) {
  const result: number[] = []

  for (let i = 0; i < 9; i++) {
    if (boards[i] === '')
      result.push(i)
  }

  return result
}

export function findBestMove (boards: string[], player: string) {
  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove  = 0

  for (const i of getEmptySpot(boards)) {
    boards[i] = player

    const score = minimax(boards, player)

    boards[i] = ''

    if (score > bestScore) {
      bestScore = score
      bestMove  = i
    }
  }

  return bestMove
}

export function findLastMove (boards: string[]) {
  const moves = getEmptySpot(boards)

  if (moves.length === 1)
    return moves[0]
}

export function checkBoardFull (boards: string[]) {
  return boards.every((i) => i !== '')
}

export function checkWinner (boards: string[]): string | undefined {
  const winner = findWinPattern(boards)

  if (winner)
    return boards[winner[0]]
}

export function minimax (boards: string[], player: string, isMaximizing = false, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
  const winner = checkWinner(boards)

  if (winner) {
    return winner === player
      ? 10
      : -10
  }

  if (checkBoardFull(boards))
    return 0

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY

    for (const i of getEmptySpot(boards)) {
      boards[i] = player

      const score = minimax(boards, player, false, alpha, beta)

      boards[i] = ''
      bestScore = Math.max(score, bestScore)
      alpha     = Math.max(alpha, bestScore)

      if (alpha > beta)
        break
    }

    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY

    for (const i of getEmptySpot(boards)) {
      boards[i] = findOpponent(player)

      const score = minimax(boards, player, true, alpha, beta)

      boards[i] = ''
      bestScore = Math.min(score, bestScore)
      beta      = Math.min(beta, bestScore)

      if (alpha > beta)
        break
    }

    return bestScore
  }
}
