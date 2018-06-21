<template>
  <span class="root">
    <a @click="updateActiveEventIndex(i)" :class="{ active: i === activeEventIndex }">
      {{ event }}
    </a>
    <span v-if="subevent" class="subevent">
      {{ subevent }}
    </span>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Event',
  props: ['event', 'subevent', 'time', 'properties', 'i'],
  methods: mapMutations(['updateActiveEventIndex']),
  computed: mapState(['activeEventIndex'])
}
</script>

<style scoped>
.active {
  color: red
}
.subevent {
  color: #666;
  font-style: italic;
  margin-left: 1em;
}
</style>
