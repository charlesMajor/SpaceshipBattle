import { setupServer } from 'msw/node'
import { render, cleanup } from '@testing-library/vue'
import { describe, expect, afterEach, test, beforeAll, afterAll } from 'vitest'
import GameCharacter from '../game/GameCharacter.vue'
import { ships } from '../../tests/data/ships'
import {
  success,
  successSpecificCharacter,
  specificCharacter
} from '../../tests/mocks/handlers'
import { mount } from '@vue/test-utils'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('GameCharacter.vue', () => {
  afterEach(async () => cleanup())

  const anyPlayerName = 'PlayerName'
  const anyShipId = ships[0].id.toString()
  const RANK = ['Débutant', 'Confirmé', 'Expert', 'Maitre']

  describe("Tests d'affichage.", () => {
    describe('Pour un joueur.', () => {
      test('À la création, le nom du joueur est affiché.', async () => {
        const { findByRole } = render(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        const playerNameEl = await findByRole('heading')

        expect(playerNameEl.innerHTML).toStrictEqual(anyPlayerName)
      })
      test('À la création, le nom du vaisseau est affiché.', async () => {
        const { findByText } = render(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        const shipName = ships.find(ship => ship.id == parseInt(anyShipId)).name
        const shipNameEl = await findByText(shipName)

        expect(shipNameEl.innerHTML).toStrictEqual(shipName)
      })
      test('À la création, les crédits du joueur sont affichés à zéro.', async () => {
        const { findByText } = render(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        const credit = '0'
        const creditEl = await findByText(credit)

        expect(creditEl.innerHTML).toStrictEqual(credit + ' ')
      })
      test("À la création, l'expérience du joueur est Maitre.", async () => {
        const { findByText } = render(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        const experience = 'Maitre'
        const experienceEl = await findByText(experience)

        expect(experienceEl.innerHTML).toStrictEqual(experience)
      })
      test('À la création, la vie du vaisseau en pourcentage est de 100%.', async () => {
        const { findByText } = render(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        const shipVitality = '100 %'
        const shipVitalityEl = await findByText(shipVitality)

        expect(shipVitalityEl.innerHTML).toStrictEqual(shipVitality + ' ')
      })
    })

    describe('Pour un ennemi.', () => {
      test("À la création, le nom de l'ennemi est affiché.", async () => {
        server.use(...successSpecificCharacter)

        const { findByText } = render(GameCharacter, {
          props: {
            isPlayer: false
          }
        })

        const enemyName = specificCharacter.ship.name
        const enemyNameEl = await findByText(enemyName)

        expect(enemyNameEl.innerHTML).toStrictEqual(enemyName)
      })
      test('À la création, le nom du vaisseau est affiché.', async () => {
        server.use(...successSpecificCharacter)

        const { findByText } = render(GameCharacter, {
          props: {
            isPlayer: false
          }
        })

        const shipName = specificCharacter.ship.name
        const shipNameEl = await findByText(shipName)

        expect(shipNameEl.innerHTML).toStrictEqual(shipName)
      })
      test('À la création, les crédits sont affichés à zéro.', async () => {
        server.use(...successSpecificCharacter)

        const { findByText } = render(GameCharacter, {
          props: {
            isPlayer: false
          }
        })

        const credit = specificCharacter.credit
        const creditEl = await findByText(credit)

        expect(creditEl.innerHTML).toStrictEqual(credit + ' ')
      })
      test("À la création, l'expérience est affichée.", async () => {
        server.use(...successSpecificCharacter)

        const { findByText } = render(GameCharacter, {
          props: {
            isPlayer: false
          }
        })

        const experience = RANK[specificCharacter.experience - 1]
        const experienceEl = await findByText(experience)

        expect(experienceEl.innerHTML).toStrictEqual(experience)
      })
      test('À la création, la vie du vaisseau en pourcentage est affichée.', async () => {
        server.use(...successSpecificCharacter)

        const { findByText } = render(GameCharacter, {
          props: {
            isPlayer: false
          }
        })

        const shipVitality = specificCharacter.ship.vitality + ' %'
        const shipVitalityEl = await findByText(shipVitality)

        expect(shipVitalityEl.innerHTML).toStrictEqual(shipVitality + ' ')
      })
    })

    describe('Tests de logique.', () => {
      test("À la mort d'un personnage, doit émettre l'évenement characterDeath.", async () => {
        const component = mount(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: true
          }
        })

        await component.setData({ shipData: { vitality: 0 } })

        expect(component.emitted('characterDeath')).toBeTruthy()
      })
      test("L'évenement characterDeath doit passer en paramètre si le personnage est le joueur.", async () => {
        const expectedIsPlayer = true
        const component = mount(GameCharacter, {
          props: {
            playerName: anyPlayerName,
            shipId: anyShipId,
            isPlayer: expectedIsPlayer
          }
        })

        await component.setData({ shipData: { vitality: 0 } })

        expect(component.emitted('characterDeath')[0][0]).toBe(expectedIsPlayer)
      })
      test("L'évenement characterDeath doit passer en paramètre si le personnage n'est pas le joueur.", async () => {
        const expectedIsPlayer = false
        const component = mount(GameCharacter, {
          props: {
            isPlayer: expectedIsPlayer
          }
        })

        await component.setData({ shipData: { vitality: 0 } })

        expect(component.emitted('characterDeath')[0][0]).toBe(expectedIsPlayer)
      })
    })
    test("À la destruction, l'ennemi emit un événement avec le nombre de CG donnés au joueur", async () => {
      server.use(...successSpecificCharacter)

      const component = mount(GameCharacter, {
        props: {
          isPlayer: false
        }
      })

      const credit = specificCharacter.credit
      await component.setData({
        characterData: { credit: specificCharacter.credit }
      })
      await component.setData({ shipData: { vitality: 0 } })

      expect(component.emitted('characterDeath')[0][1]).toStrictEqual(credit)
    })
  })
})
