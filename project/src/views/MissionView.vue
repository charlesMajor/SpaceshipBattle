<template>
  <div>
    <GameController
      v-bind:playerName="this.playerName"
      v-bind:shipId="this.shipId"
      @travelToScore="travelToScore"
      @travelToHome="travelToHome"
    />
  </div>
  <div>
    <ConfirmModal
      @onModalConfirmed="travelConfirmed"
      :trigger="triggerModal"
      title="Warning"
      body="This game will be lost. Do you want to leave this page?"
      cancelButton="No"
      confirmButton="Yes"
    />
  </div>
</template>

<script>
import GameController from '../components/game/GameController.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

export default {
  name: 'MissionView',
  props: {
    playerName: {
      type: String,
      require: true
    },
    shipId: {
      type: String,
      require: true
    }
  },
  components: {
    GameController,
    ConfirmModal
  },
  data () {
    return {
      currentDestination: '',
      triggerModal: 0,
      canLeave: false
    }
  },
  methods: {
    travelConfirmed () {
      this.canLeave = true
      this.$router.push({ name: this.currentDestination })
    },
    travelToScore () {
      this.canLeave = true
      this.$router.push({ name: 'Score' })
    },
    travelToHome () {
      this.canLeave = true
      this.$router.push({ name: 'Home' })
    }
  },
  beforeRouteLeave (to) {
    this.currentDestination = to.name
    if (!this.canLeave) {
      this.triggerModal++
      return false
    }
    return true
  }
}
</script>

<style lang="scss" scoped></style>
