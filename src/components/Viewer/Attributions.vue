<template>
  <div>
    <i-table :columns="columns" :data="data"></i-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Table } from 'iview'
export default {
  name: 'Attributions',
  components: { 'i-table': Table },
  computed: {
    ...mapGetters(['activeEvent']),
    columns () {
      return [{ title: 'key', key: 'key' }, { title: 'value', key: 'value' }]
    },
    data () {
      if (this.activeEvent) {
        return this.activeEvent.attributions.map(attr => ({ key: attr.name, value: attr.value }))
      }
    }
  }
}
</script>
