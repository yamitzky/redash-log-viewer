<template>
  <div>
    <p>
      Input Redash's Query ID: <input-number style="width: 80px;" v-model="queryId"></input-number>
    </p>
    <p v-if="url">
      Open <router-link :to="path">{{ url }}</router-link>
    </p>
    <p>
      e.g. https://app.redash.com/queries/<span v-if="queryId">{{ queryId }}</span><i v-else>:queryId:</i>
    </p>
  </div>
</template>

<script>
import { InputNumber } from 'iview'
export default {
  name: 'Home',
  components: {
    InputNumber
  },
  data () {
    return {
      queryId: null
    }
  },
  computed: {
    path () {
      if (this.queryId) {
        return `/queries/${this.queryId}`
      }
    },
    url () {
      if (this.path) {
        return `${location.origin}${this.path}`
      }
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 1em;
}
</style>
