import { describe, test, expect, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { success } from '../../tests/mocks/handlers.js'
import { ships } from '../../tests/data/ships'
import { shipsService } from '../shipsService'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('shipsService.js', () => {
  test("getShips doit retourner l'ensemble des ships.", async () => {
    const response = await shipsService.getShips()

    expect(response).toStrictEqual(ships)
  })

  test("getShip doit retourner le ship avec l'id correspondant.", async () => {
    const shipId = ships[0].id

    const response = await shipsService.getShip(shipId)

    expect(response.id).toStrictEqual(shipId)
  })
})
