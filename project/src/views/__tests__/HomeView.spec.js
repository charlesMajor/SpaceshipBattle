import { setupServer } from 'msw/node'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import {
  describe,
  afterEach,
  test,
  beforeAll,
  afterAll,
  expect,
  vi
} from 'vitest'
import HomeView from '../HomeView.vue'
import routes from '../../router/routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { ships } from '../../tests/data/ships'
import { success } from '../../tests/mocks/handlers'

let router

const server = setupServer(...success)
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  router = createRouter({
    history: createWebHistory(),
    routes: routes
  })
})
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
})

describe.skip('HomeView.vue', () => {
  afterEach(async () => cleanup())

  describe('Navigation', () => {})
})
