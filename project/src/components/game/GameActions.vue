<template>
  <div class="col-md-6 mb-5">
    <div class="card shadow-lg h-100">
      <div class="card-header">
        <h2 class="m-0">Actions</h2>
      </div>
      <div class="card-body pt-2">
        <div class="row mt-2">
          <div class="col-6 d-grid">
            <button
              type="button"
              class="btn btn-outline-dark btn-lg"
              @click="onFight()"
            >
              Fight
            </button>
          </div>
          <div class="col-6 d-grid">
            <button
              type="button"
              class="btn btn-outline-dark btn-lg"
              @click="onMissionEnded()"
            >
              Finish this mission here
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameActions',
  emits: ['fight', 'missionEnded'],
  methods: {
    onFight () {
      this.$emit('fight')
    },
    onMissionEnded () {
      this.$emit('missionEnded')
    }
  }
}
</script>

<style lang="scss" scoped></style>
