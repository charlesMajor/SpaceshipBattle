import { setupServer } from 'msw/node'
import { mount } from '@vue/test-utils'
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
import GameController from '../game/GameController.vue'
import GameActions from '../game/GameActions.vue'
import GameCharacter from '../game/GameCharacter.vue'
import GameMission from '../game/GameMission.vue'
import { ships } from '../../tests/data/ships'
import {
  success,
  successSpecificCharacter,
  specificCharacter
} from '../../tests/mocks/handlers'

const server = setupServer(...success)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('GameController.vue', () => {
  afterEach(async () => cleanup())

  const anyPlayerName = 'PlayerName'
  const anyShipId = ships[0].id.toString()

  describe('Tests de logique.', () => {
    test("À la réception de l'évenement fight, la méthode fight est appelée 2 fois.", async () => {
      const component = await mount(GameController, {
        props: {
          playerName: anyPlayerName,
          shipId: anyShipId
        }
      })

      const spyGameController = vi.spyOn(component.vm, 'fight')
      await component.findComponent(GameActions).vm.$emit('fight')

      expect(spyGameController).toHaveBeenCalledTimes(2)
    })
    test("À la réception de l'évenement characterDeath pour le joueur, la méthode onPlayerDeath est appelée.", async () => {
      const component = await mount(GameController, {
        props: {
          playerName: anyPlayerName,
          shipId: anyShipId
        }
      })

      const spyGameController = vi.spyOn(component.vm, 'onPlayerDeath')
      await component
        .findComponent(GameCharacter)
        .vm.$emit('characterDeath', true)

      expect(spyGameController).toHaveBeenCalled()
    })
    test("À la réception de l'évenement characterDeath pour l'ennemi, la méthode onEnemyDeath est appelée.", async () => {
      const component = await mount(GameController, {
        props: {
          playerName: anyPlayerName,
          shipId: anyShipId
        }
      })

      const spyGameController = vi.spyOn(component.vm, 'onEnemyDeath')
      await component
        .findComponent(GameCharacter)
        .vm.$emit('characterDeath', false)

      expect(spyGameController).toHaveBeenCalled()
    })

    test("À la mort d'un ennemi le nombre de missions incrémente", async () => {
      const component = await mount(GameController)

      const missionEl = await component.findComponent(GameMission)

      await component
        .findComponent(GameCharacter)
        .vm.$emit('characterDeath', false)

      expect(missionEl.find('.missions').text()).toBe('2/5')
    })

    test("À la mort d'un ennemi, un autre ennemi est affiché", async () => {
      const component = await mount(GameController)

      const enemyEl = await component.findAllComponents(GameCharacter)[1]

      const spyGameController = vi.spyOn(enemyEl.vm, 'loadFromCharacters')

      await component
        .findComponent(GameCharacter)
        .vm.$emit('characterDeath', false)

      expect(spyGameController).toHaveBeenCalled()
    })
  })
})
