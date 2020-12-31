// Расчитываем урон
function dmg(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function normalizeHealth(health) {
  if (health > 100) health = 100
  if (health < 0) health = 0
  return health
}

function checkWinner(playerHealth, monsterHealth) {

  if (playerHealth <= 0 && monsterHealth <= 0)
    return 'draw'
  else if (playerHealth <= 0)
    return 'monster'
  else if (monsterHealth <= 0)
    return 'player'
  else
    return null

}


function hpLogger(newValue, oldValue, attackerName) {

  if ((oldValue - newValue) < 0)
    return `<span class="log--player">Игрок</span> восстановил здоровье на <span class="log--heal">${newValue - oldValue}</span> HP`
  return `<span class="${attackerName === 'Монстр' ? 'log--monster' : 'log--player'}">${attackerName}</span> нанес урона на <span class="log--damage">${oldValue - newValue}</span> HP`
}


const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 1,
      winner: null,
      battleLog: []
    }
  },
  methods: {
    startNewGame() {
      console.log('startNewGame')
      this.playerHealth = this.monsterHealth = 100;
      this.battleLog = []
      this.currentRound = 1
      this.winner = null
    },
    attackMonster() {
      console.log('attackMonster')
      this.monsterHealth -= dmg(5, 12)
    },
    attackPlayer() {
      console.log('attackPlayer')
      this.playerHealth -= dmg(5, 20)
    },
    specialAttack() {
      console.log('specialAttack')
      this.monsterHealth -= dmg(12, 35)
    },
    healPlayer() {
      console.log('health')
      this.playerHealth += dmg(2, 25)
    },
    block() {
      console.log('block')

      if (dmg(1, 3) === 2) {
        this.battleLog.unshift('Игрок заблокировал удар монстра')
        this.currentRound++
      } else
        this.attackPlayer()
    }
  },
  computed: {
    playerHealthBar() {
      console.log('playerHealthBar')
      return {'width': normalizeHealth(this.playerHealth) + '%'}
    },
    monsterHealthBar() {
      console.log('monsterHealthBar')
      return {'width': normalizeHealth(this.monsterHealth) + '%'}
    },

    abilityAvailableHealth() {
      console.log('abilityAvailableHealth')
      return this.currentRound % 5 !== 0
    },

    abilityAvailableSpecialAttack() {
      console.log('abilityAvailableSpecialAttack')
      return this.currentRound % 3 !== 0
    }

  },
  watch: {
    monsterHealth: function (newValue, oldValue) {

      if (newValue === 100)
        return

      this.battleLog.unshift(hpLogger(newValue, oldValue, 'Игрок'))

      this.attackPlayer()
      this.winner = checkWinner(this.playerHealth, this.monsterHealth)
    },

    playerHealth(newValue, oldValue) {

      if (newValue === 100)
        return

      this.battleLog.unshift(hpLogger(newValue, oldValue, 'Монстр'))

      this.currentRound++;

      if (oldValue < newValue)
        this.attackPlayer()

      this.winner = checkWinner(this.playerHealth, this.monsterHealth)
    }
  }

})


app.mount('#game')