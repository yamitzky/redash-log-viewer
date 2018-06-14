<template>
  <div>
    <div class="control">
      <control></control>
    </div>
    <div class="viewer">
      <alert v-if="error" type="error" show-icon closable>{{ error }}</alert>
      <alert v-if="pollingElapsed != null" show-icon>Executing query... {{ pollingElapsed }}s</alert>
      <alert v-if="missingColumns.length" type="error" show-icon closable>Columns {{ missingColumns }} are missing. Please edit the query to define them.</alert>
      <viewer v-if="Object.keys(queryResult).length"></viewer>
      <p v-else>Please click `Execute` button to load query result.</p>
    </div>
  </div>
</template>

<script>
import Control from './Control'
import Viewer from './Viewer'
import { Alert } from 'iview'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'Main',
  components: {
    Control,
    Viewer,
    Alert
  },
  methods: mapActions(['fetchQuery', 'refreshQueryResult']),
  computed: {
    ...mapState(['queryResult', 'error']),
    ...mapGetters(['pollingElapsed', 'missingColumns', 'queryResultFetched', 'executable'])
  },
  async mounted () {
    await this.fetchQuery()
    if (!this.queryResultFetched && this.executable) {
      await this.refreshQueryResult()
    }
  }
}
</script>

<style scoped>
.control {
  padding-bottom: 1.5em;
  border-bottom: 1px solid #ddd;
}
.viewer {
  padding-top: 2.5em;
  margin: 0 auto;
}
</style>
