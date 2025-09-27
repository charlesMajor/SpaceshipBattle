import axios from 'axios'
import { API_REST } from '../shared/config'

async function getCharacters (page, limit) {
  const { data } = await axios.get(
    `${API_REST}/characters?_page=${page}&_limit=${limit}`
  )
  return data
}

async function getAmountCharacters () {
  const response = await axios.get(`${API_REST}/characters?_page=1&_limit=1`)
  return response.headers['x-total-count']
}

export const charactersService = {
  getCharacters,
  getAmountCharacters
}
