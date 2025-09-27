<template>
  <div class="container">
    <div class="row">
      <h1 class="text-center mt-5 mb-4">Play</h1>
    </div>
    <div class="row gx-5">
      <GameActions @fight="onFightClicked" @missionEnded="endMission" />
      <GameMission v-bind:missionsDone="this.missionsDone + 1" />
    </div>
    <div class="row gx-5">
      <GameCharacter
        ref="player"
        v-bind:isPlayer="true"
        v-bind:playerName="this.playerName"
        v-bind:shipId="this.shipId"
        @characterDeath="onCharacterDeath"
      />
      <GameCharacter
        ref="enemy"
        v-bind:isPlayer="false"
        @characterDeath="onCharacterDeath"
      />
    </div>
  </div>
  <div>
    <InfoModal
      :trigger="triggerModal"
      v-bind:title="infoModalTitle"
      v-bind:body="infoModalBody"
      confirmButton="Ok"
    />
  </div>
</template>

<script>
import GameActions from './GameActions.vue'
import GameMission from './GameMission.vue'
import GameCharacter from './GameCharacter.vue'
import InfoModal from '../InfoModal.vue'
import { rankingService } from '../../services/rankingService'

const PLAYER_FIGHT_CHANCES = [0.2, 0.35, 0.5, 0.7]
const MIN_DAMAGE_TAKEN = 3
const MAX_DAMAGE_TAKEN = 6
const NB_MISSION = 5

export default {
  name: 'GameController',
  emits: ['travelToScore', 'travelToHome'],
  components: {
    GameActions,
    GameMission,
    GameCharacter,
    InfoModal
  },
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
  data () {
    return {
      missionsDone: 0,
      triggerModal: 0,
      infoModalBody: '',
      infoModalTitle: ''
    }
  },
  methods: {
    onFightClicked () {
      this.fight(this.$refs.player, this.$refs.enemy)
      this.fight(this.$refs.enemy, this.$refs.player)
    },
    fight (attacker, defender) {
      if (
        this.canAttack(
          PLAYER_FIGHT_CHANCES[attacker.characterData.experience - 1]
        )
      ) {
        defender.takeDamage(this.damageTaken())
      }
    },
    canAttack (percentage) {
      return Math.random() < percentage
    },
    damageTaken () {
      Math.ceil(MIN_DAMAGE_TAKEN)
      Math.floor(MAX_DAMAGE_TAKEN)
      return Math.floor(
        Math.random() * (MAX_DAMAGE_TAKEN - MIN_DAMAGE_TAKEN + 1) +
          MIN_DAMAGE_TAKEN
      )
    },
    onCharacterDeath (isPlayer, credit) {
      if (isPlayer) {
        this.onPlayerDeath()
      } else {
        this.onEnemyDeath(credit)
        this.endMission()
      }
    },
    async endMission () {
      if (this.missionsDone + 1 == NB_MISSION) {
        this.onGameEnding()
      } else {
        this.missionsDone++
        await this.$refs.enemy.loadFromCharacters()
      }
    },
    onPlayerDeath () {
      this.infoModalTitle = 'You lost!'
      this.infoModalBody = 'You did not complete the 5 missions.'
      this.triggerModal++

      this.$emit('travelToHome')
    },
    onEnemyDeath (credit) {
      this.$refs.player.addCredits(credit)

      if (this.missionsDone + 1 != NB_MISSION) {
        this.infoModalTitle = 'Congratulations!'
        this.infoModalBody = 'You gained ' + credit + ' galactic credits'
        this.triggerModal++
      }
    },
    async onGameEnding () {
      try {
        await rankingService.postRanking(
          this.$refs.player.playerName,
          this.$refs.player.characterData.credit
        )
      } catch (error) {
        this.displayErrorMessage('Error with the service: ' + error.message)
      }

      this.$emit('travelToScore')

      this.infoModalTitle = 'Your score'
      this.infoModalBody =
        'You finished with a total of ' +
        this.$refs.player.characterData.credit +
        ' galactic credits.'
      this.triggerModal++
    }
  }
}
</script>

<style lang="scss" scoped></style>
