<template>
    <a @click="updateActiveEventIndex(i)" :class="{ active: i === activeEventIndex }">
      {{ event }}
    </a>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Event',
  props: ['event', 'time', 'properties', 'i'],
  methods: mapMutations(['updateActiveEventIndex']),
  computed: mapState(['activeEventIndex'])
}
</script>

<style scoped>
.active {
  color: red
}
</style>
