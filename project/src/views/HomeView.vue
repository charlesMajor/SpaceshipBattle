<template>
  <div class="container">
    <div class="row-3">
      <div class="col m-5">
        <h2>Your objective : {{ objective }}</h2>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <form class="border" @submit.prevent="moveToMission">
          <div class="m-3">
            <label for="playerName" class="form-label">Your name :</label>
            <input
              type="text"
              id="playerName"
              class="form-control"
              v-model="playerName"
              required
            />
          </div>
          <div class="m-3">
            <label for="shipName" class="form-label">Your ship :</label>
            <Loading :active="isLoading" />
            <select
              name="shipName"
              id="shipName"
              class="form-select"
              v-model="shipId"
              v-show="!isLoading"
            >
              <option v-for="ship in ships" :key="ship.id" :value="ship.id">
                {{ ship.name }}
              </option>
            </select>
          </div>
          <div class="m-3 d-grid gap-2">
            <button
              type="submit"
              class="btn btn-primary text-white text-decoration-none fw-bold"
            >
              Start game
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toast-notification'
import { shipsService } from '../services/shipsService'
import Loading from 'vue-loading-overlay'

export default {
  name: 'HomeView',
  components: {
    Loading
  },
  data () {
    return {
      ships: [],
      objective:
        'Survive 5 missions and obtains as much galactic credits you can',
      playerName: '',
      selectedShip: '',
      shipId: '',
      isLoading: false
    }
  },
  async created () {
    this.isLoading = true
    try {
      this.ships = await shipsService.getShips()
      this.selectedShip = this.ships[0].name
      this.shipId = this.ships[0].id
    } catch (error) {
      useToast().open({
        type: 'error',
        message: 'Error with the service: ' + error.message,
        duration: 6000
      })
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    moveToMission () {
      this.$router.push({
        name: 'Mission',
        params: { playerName: this.playerName, shipId: this.shipId }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
