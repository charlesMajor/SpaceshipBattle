import { describe, test, expect, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { success } from '../../tests/mocks/handlers.js'
import { characters } from '../../tests/data/characters'
import { charactersService } from '../charactersService'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('charactersService.js', () => {
  test("getCharacters doit retourner l'ensemble des characters selon la page et le nombre par page.", async () => {
    const page = 1
    const limit = 1
    const expectedCharacter = characters

    const response = await charactersService.getCharacters(page, limit)

    expect(response).toStrictEqual(
      expectedCharacter.slice(page - 1 * limit, page - 1 * limit + limit)
    )
  })
})
