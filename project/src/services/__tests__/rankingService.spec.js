import { describe, test, expect, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { success } from '../../tests/mocks/handlers.js'
import { ranking } from '../../tests/data/ranking.js'
import { rankingService } from '../rankingService.js'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('rankingService.js', () => {
  test("getRanking doit retourner l'ensemble des scores ainsi que les joueurs associés.", async () => {
    const response = await rankingService.getRanking()

    expect(response).toStrictEqual(ranking)
  })

  test('postRanking doit créer et retourner une entrée de score.', async () => {
    const name = 'PlayerName'
    const score = 1000

    const response = await rankingService.postRanking(name, score)

    expect(response).toStrictEqual(ranking[ranking.length - 1])
  })
})
