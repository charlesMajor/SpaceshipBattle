<template>
  <div class="col-md-6 mb-5">
    <div class="card shadow-lg h-100">
      <div class="card-header">
        <h2 class="m-0">Current mission</h2>
      </div>
      <div class="card-body pt-2 text-center mt-2">
        <div class="row mb-1">
          <p class="mb-0 fs-4 missions">{{ missionsDone }}/5</p>
        </div>
        <div class="row">
          <p class="mb-0 fs-6">Objective: {{ objective }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const NB_MISSION = 5

export default {
  name: 'GameMission',
  props: {
    missionsDone: {
      type: Number
    }
  },
  data () {
    return {
      objective:
        'Survive ' + NB_MISSION + ' missions and obtain as much GC you can.'
    }
  }
}
</script>

<style lang="scss" scoped></style>
