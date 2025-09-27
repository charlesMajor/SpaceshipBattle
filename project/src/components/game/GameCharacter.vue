<template>
  <div class="col-md-6 mb-5">
    <div class="card shadow-lg h-100">
      <div class="card-header">
        <h2 class="m-0">{{ name }}</h2>
      </div>
      <div class="card-body pt-2">
        <div class="row mb-2">
          <div class="col-6">
            <p class="text-start fs-4">{{ this.rank }}</p>
          </div>
          <div class="col-6 text-end">
            <p class="fs-4 d-inline">
              {{ this.characterData.credit + ' ' }}
            </p>
            <p class="fs-5 d-inline">CG</p>
          </div>
        </div>
        <p class="text-center fs-3 mb-1">{{ shipData.name }}</p>
        <div class="progress" style="height: 32px">
          <div
            class="progress-bar fs-4"
            :class="progressBarColor"
            role="progressbar"
            :style="{ width: shipData.vitality + '%' }"
            :aria-valuenow="shipData.vitality"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {{ shipData.vitality }} %
          </div>
        </div>
      </div>
    </div>
  </div>
  <Loading :active="isLoading" />
</template>

<script>
import { charactersService } from '../../services/charactersService'
import { shipsService } from '../../services/shipsService'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'vue-toast-notification'

const RANK = ['Beginner', 'Confirmed', 'Expert', 'Master']
const PROGRESS_BAR_COLOR = ['bg-success', 'bg-warning', 'bg-danger']
const MAX_SHIP_VITALITY = 100

export default {
  name: 'GameCharacter',
  emits: ['characterDeath'],
  props: {
    playerName: {
      type: String
    },
    shipId: {
      type: String
    },
    isPlayer: {
      type: Boolean,
      require: true
    },
    loadTrigger: {
      type: Number
    }
  },
  components: {
    Loading
  },
  data () {
    return {
      isLoading: false,
      characterData: [],
      shipData: [],
      name: this.playerName,
      progressBarColor: PROGRESS_BAR_COLOR[0],
      amountOfCharactersInBd: 0,
      deadEnemies: [],
      rank: ''
    }
  },
  async created () {
    if (this.isPlayer) {
      this.characterData = {
        experience: RANK.length,
        credit: 0
      }
      await this.loadPlayerShip()
    } else {
      this.computeAmountCharacters()
      await this.loadFromCharacters()
    }
  },
  methods: {
    async computeAmountCharacters () {
      try {
        this.amountOfCharactersInBd =
          await charactersService.getAmountCharacters()
      } catch (error) {
        this.displayErrorMessage('Error with the service: ' + error.message)
      }
    },
    convertToRank (experience) {
      return RANK[experience - 1]
    },
    takeDamage (damage) {
      if (this.shipData.vitality - damage < 0) {
        this.shipData.vitality = 0
      } else {
        this.shipData.vitality -= damage
      }
      this.updateProgressBar()
    },
    updateProgressBar () {
      if (this.shipData.vitality > (2 / 3) * 100) {
        this.progressBarColor = PROGRESS_BAR_COLOR[0]
      } else if (this.shipData.vitality > (1 / 3) * 100) {
        this.progressBarColor = PROGRESS_BAR_COLOR[1]
      } else {
        this.progressBarColor = PROGRESS_BAR_COLOR[2]
      }
    },
    async loadFromCharacters () {
      this.isLoading = true
      try {
        let isAcceptable = false
        while (!isAcceptable) {
          this.characterData = await charactersService.getCharacters(
            this.getRandomNumberForCharacter(),
            1
          )
          this.characterData = this.characterData[0]
          isAcceptable = true
          this.deadEnemies.forEach(deadEnemy => {
            if (deadEnemy.id == this.characterData.id) {
              isAcceptable = false
            }
          })
        }

        this.shipData = this.characterData.ship
        this.name = this.characterData.name
        this.updateProgressBar()
      } catch (error) {
        this.displayErrorMessage('Error with the service: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },
    getRandomNumberForCharacter () {
      return Math.floor(Math.random() * this.amountOfCharactersInBd)
    },
    async loadPlayerShip () {
      this.isLoading = true
      try {
        this.shipData = await shipsService.getShip(this.shipId)
        this.shipData.vitality = MAX_SHIP_VITALITY
      } catch (error) {
        this.displayErrorMessage('Error with the service: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },
    displayErrorMessage (errorMessage) {
      useToast().open({
        type: 'error',
        message: errorMessage,
        duration: 6000
      })
    },
    onCharacterDeath () {
      this.deadEnemies.push(this.characterData.id)
      this.$emit('characterDeath', this.isPlayer, this.characterData.credit)
    },
    addCredits (credit) {
      this.characterData.credit += credit
    }
  },
  watch: {
    'shipData.vitality': function () {
      if (this.shipData.vitality <= 0) {
        this.onCharacterDeath()
      }
    },
    'characterData.experience': function () {
      this.rank = this.convertToRank(this.characterData.experience)
    }
  }
}
</script>

<style lang="scss" scoped></style>
