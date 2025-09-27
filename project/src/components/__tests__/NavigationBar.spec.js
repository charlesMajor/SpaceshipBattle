import { render, fireEvent, cleanup } from '@testing-library/vue'
import { describe, afterEach, test, beforeAll, expect, vi } from 'vitest'
import NavigationBar from '../NavigationBar.vue'
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

describe('routes.js', () => {
  test('Doit pouvoir naviguer vers la page Home.', async () => {
    const { findByRole } = render(NavigationBar, {
      global: {
        plugins: [router]
      }
    })
    const routerSpy = vi.spyOn(router, 'push')

    const linkEl = await findByRole('link', { name: /Accueil/i })
    await fireEvent.click(linkEl)

    expect(routerSpy).toHaveBeenCalledWith('/')
  })
  test('Doit pouvoir naviguer vers la page Pointage.', async () => {
    const { findByRole } = render(NavigationBar, {
      global: {
        plugins: [router]
      }
    })
    const routerSpy = vi.spyOn(router, 'push')

    const linkEl = await findByRole('link', { name: /Pointage/i })
    await fireEvent.click(linkEl)

    expect(routerSpy).toHaveBeenCalledWith('/score')
  })
})
