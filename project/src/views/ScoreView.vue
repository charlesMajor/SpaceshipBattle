<template>
  <div class="container text-center">
    <div class="row mt-4 mb-2">
      <h1 class="h1">Scoreboard</h1>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <table class="table table-bordered">
          <thead>
            <tr class="table-active">
              <th class="w-50" scope="col">Score</th>
              <th class="w-50" scope="col">Player</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rank in rankingData" v-bind:key="rank.id">
              <td>{{ rank.score }} GC</td>
              <td>{{ rank.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Loading :active="isLoading" />
  </div>
</template>

<script>
import { rankingService } from '../services/rankingService'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'vue-toast-notification'

export default {
  name: 'ScoreView',
  components: {
    Loading
  },
  data () {
    return {
      rankingData: [],
      isLoading: false
    }
  },
  async created () {
    this.isLoading = true
    try {
      this.rankingData = await rankingService.getRanking()
      this.rankingData.sort((b, a) => a.score - b.score)
    } catch (error) {
      useToast().open({
        type: 'error',
        message: 'Erreur avec le service: ' + error.message,
        duration: 6000
      })
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
