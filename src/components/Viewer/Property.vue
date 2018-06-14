<template>
  <vue-json-pretty :data="this.activeEvent.property"></vue-json-pretty>
</template>

<script>
import { mapGetters } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
export default {
  name: 'Property',
  components: {
    VueJsonPretty
  },
  computed: mapGetters(['activeEvent'])
}
</script>

<style>
.vjs__value__string {
  color: #1c8e28 !important;
}
</style>
