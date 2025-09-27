import { render, fireEvent, cleanup } from '@testing-library/vue'
import { describe, afterEach, test, beforeAll, expect, vi } from 'vitest'
import MissionView from '../MissionView.vue'
import routes from '../../router/routes.js'
import { createRouter, createWebHistory } from 'vue-router'

let router

beforeAll(() => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes
  })
})
afterEach(() => {
  cleanup()
})

describe('MissionView.vue', () => {
  describe('Navigation', () => {
    test('Doit pouvoir confirmer le déplacement vers home.', async () => {
      const spyRouter = vi.spyOn(router, 'push')
      const { getByRole } = render(MissionView, {
        global: {
          plugins: [router]
        }
      })

      await fireEvent.click(getByRole('button', { name: /oui/i, hidden: true }))

      expect(spyRouter).toHaveBeenCalled()
    })

    test('Doit pouvoir annuler le déplacement vers home.', async () => {
      const spyRouter = vi.spyOn(router, 'push')
      const { getByRole } = render(MissionView, {
        global: {
          plugins: [router]
        }
      })
      const dialogCancelButtonEl = getByRole('button', {
        name: /non/i,
        hidden: true
      })

      await fireEvent.click(dialogCancelButtonEl)

      expect(spyRouter).not.toHaveBeenCalled()
    })
  })
})
