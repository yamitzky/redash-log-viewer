<template>
  <div :style="{ lineHeight: `${margin}em`, height: `${margin}em`, borderLeftWidth: `${border}px` }" class="root">{{ duration }}</div>
</template>

<script>
export default {
  name: 'DurationSpacer',
  props: ['seconds'],
  computed: {
    duration () {
      if (this.seconds <= 1) {
        return null
      } else if (this.seconds < 60) {
        return `${this.seconds}s`
      } else if (this.seconds < 3600) {
        const minutes = parseInt(this.seconds / 60)
        const seconds = this.seconds - minutes * 60
        return `${minutes}m, ${seconds}s`
      } else if (this.seconds < 86400) {
        const hours = parseInt(this.seconds / 3600)
        const minutes = parseInt((this.seconds - hours * 3600) / 60)
        return `${hours}h, ${minutes}m`
      } else {
        const days = parseInt(this.seconds / 86400)
        const hours = parseInt((this.seconds - days * 86400) / 3600)
        return `${days}d, ${hours}h`
      }
    },
    margin () {
      if (this.seconds <= 1) {
        return 1
      } else if (this.seconds <= 10) {
        return 3
      } else if (this.seconds <= 60) {
        return 5
      } else if (this.seconds <= 600) {
        return 7
      } else if (this.seconds <= 3600) {
        return 9
      } else if (this.seconds <= 86400) {
        return 11
      } else {
        return 13
      }
    },
    border () {
      if (this.seconds <= 1) {
        return 0
      } else if (this.seconds <= 60) {
        return 1
      } else if (this.seconds <= 3600) {
        return 2
      } else if (this.seconds <= 86400) {
        return 3
      } else {
        return 4
      }
    }
  }
}
</script>

<style scoped>
.root {
  padding-left: 1em;
  border-left: 0 solid #b9b9b9;
  font-style: italic;
}
</style>
