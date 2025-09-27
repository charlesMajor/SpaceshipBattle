import { render, cleanup, fireEvent } from '@testing-library/vue'
import { describe, test, afterEach, expect } from 'vitest'
import GameActions from '../game/GameActions.vue'

describe('GameActions.vue', () => {
  afterEach(async () => {
    cleanup()
  })

  test("Sur le clic du bouton Combattre, doit émettre l'événement fight", async () => {
    const { getAllByRole, emitted } = render(GameActions)
    const firstButtonEl = getAllByRole('button')[0]

    await fireEvent.click(firstButtonEl)

    expect(emitted('fight')).toBeTruthy()
  })

  test("Sur le clic du bouton Terminer la mission, doit émettre l'événement missionEnded", async () => {
    const { getAllByRole, emitted } = render(GameActions)
    const buttonEl = getAllByRole('button')[1]

    await fireEvent.click(buttonEl)

    expect(emitted('missionEnded')).toBeTruthy()
  })
})
