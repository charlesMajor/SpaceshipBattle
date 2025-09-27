import axios from 'axios'
import { API_REST } from '../shared/config'

async function getShips () {
  const { data } = await axios.get(`${API_REST}/ships`)
  return data
}

async function getShip (id) {
  const { data } = await axios.get(`${API_REST}/ships/${id}`)
  return data
}

export const shipsService = {
  getShips,
  getShip
}
