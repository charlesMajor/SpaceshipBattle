import { setupServer } from 'msw/node'
import { render, cleanup } from '@testing-library/vue'
import {
  describe,
  expect,
  afterEach,
  test,
  beforeAll,
  afterAll,
  vi
} from 'vitest'
import { useToast } from 'vue-toast-notification'
import ScoreView from '../ScoreView.vue'
import { ranking } from '../../tests/data/ranking'
import { success, failureRanking } from '../../tests/mocks/handlers'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('ScoreView.vue', () => {
  afterEach(async () => cleanup())

  const getRankingTableContent = async scoreTableEls => {
    const tableContent = scoreTableEls.map(scoreEl => [scoreEl.textContent])
    const ranking = []

    for (let i = 0; i < tableContent.length; i += 2)
      ranking.push(tableContent[i].concat(tableContent[i + 1]))

    return ranking
  }

  test("À la création de la page, les scores s'affichent dans un tableau.", async () => {
    const expectedScores = ranking
      .map(rank => [rank.score + ' CG', rank.name])
      .sort((b, a) => parseInt(a[0]) - parseInt(b[0]))
    const { findAllByRole } = render(ScoreView)

    const scoreTableEls = await findAllByRole('cell')
    const scores = await getRankingTableContent(scoreTableEls)

    expect(scores).toStrictEqual(expectedScores)
  })
  test('Le tableau est trié avec le joueur ayant le plus de points en tête de liste.', async () => {
    const { findAllByRole } = render(ScoreView)

    const scoreTableEls = await findAllByRole('cell')
    const scores = await getRankingTableContent(scoreTableEls)

    const isSorted = scores.every(
      (score, index, arr) => index === 0 || score <= arr[index - 1]
    )

    expect(isSorted).toBeTruthy()
  })
  /*describe('failure', () => {
    test("Un message doit informer l'utilisateur si l'api n'est pas joignable lors de la récupération de tous les scores.", async () => {
      server.use(...failureRanking)
      const toastrSpy = vi.spyOn(useToast(), 'open')

      await render(ScoreView)

      expect(toastrSpy).toHaveBeenCalled()
    })
  })*/
})
