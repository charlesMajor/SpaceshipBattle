import { render, cleanup } from '@testing-library/vue'
import { describe, expect, afterEach, test } from 'vitest'
import GameMission from '../game/GameMission.vue'

describe('GameMission.vue', () => {
  afterEach(async () => cleanup())

  test("À la création, le nombre de missions effectuées et l'objectif sont affichés.", async () => {
    const missionsDone = 1
    const { getByText } = render(GameMission, {
      props: {
        missionsDone: missionsDone
      }
    })

    const missionsDoneText = missionsDone + '/5'
    const objectifText =
      'Objectif: Survivre à 5 missions en obtenant le plus de CG.'

    const missionsEl = await getByText(missionsDoneText)
    const objectifEl = await getByText(objectifText)

    expect(missionsEl.innerHTML).toStrictEqual(missionsDoneText)
    expect(objectifEl.innerHTML).toStrictEqual(objectifText)
  })
})
