import { rest } from 'msw'
import { ranking } from '../data/ranking'
import { ships } from '../data/ships'
import { API_REST } from '../../shared/config'
import { characters } from '../data/characters'

export const success = [
  rest.get(API_REST + '/ranking', (request, response, context) => {
    return response(context.status(200), context.json(ranking))
  }),
  rest.post(API_REST + '/ranking', async (request, response, context) => {
    const score = await request.json()
    score.id = ranking.length + 1
    ranking.push(score)

    return response(context.status(201), context.json(score))
  }),
  rest.get(API_REST + '/characters', (request, response, context) => {
    const page = request.url.searchParams.get('_page')
    const limit = request.url.searchParams.get('_limit')
    return response(
      context.status(200),
      context.json(characters.slice(page - 1 * limit, page - 1 * limit + limit))
    )
  }),
  rest.get(API_REST + '/ships', (request, response, context) => {
    return response(context.status(200), context.json(ships))
  }),
  rest.get(API_REST + '/ships/:id', (request, response, context) => {
    const { id } = request.params
    const ship = ships.find(ship => ship.id === parseInt(id))
    return response(context.status(200), context.json(ship))
  })
]

export const specificCharacter = characters[0]
export const successSpecificCharacter = [
  rest.get(API_REST + '/characters', (request, response, context) => {
    return response(context.status(200), context.json([specificCharacter]))
  })
]

export const failureRanking = [
  rest.get(API_REST + '/ranking', (request, response, context) => {
    return response(context.status(400))
  })
]
