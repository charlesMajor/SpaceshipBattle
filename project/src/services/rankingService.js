import axios from 'axios'
import { API_REST } from '../shared/config'

async function getRanking () {
  const { data } = await axios.get(`${API_REST}/ranking`)
  return data
}

async function postRanking (name, score) {
  const { data } = await axios.post(`${API_REST}/ranking`, {
    name: name,
    score: score
  })
  return data
}

export const rankingService = {
  getRanking,
  postRanking
}
