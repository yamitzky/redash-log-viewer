<template>
    <div class="root">
      <h2>{{ query.name }}</h2>
      <p class="markdown-body" v-if="query.description"><vue-markdown>{{ query.description }}</vue-markdown></p>
      <div>
        <query-params></query-params>
      </div>
      <div>
        <i-button type="primary" icon="arrow-right-b" @click="refreshQueryResult" :disabled="!executable">Execute</i-button>
      </div>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import QueryParams from './QueryParams'
import { Button } from 'iview'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Control',
  components: {
    QueryParams,
    'i-button': Button,
    VueMarkdown
  },
  methods: mapActions(['refreshQueryResult']),
  computed: {
    ...mapGetters(['executable']),
    ...mapState(['query'])
  }
}
</script>

<style scoped>
.root > div {
  margin-bottom: 1em;
}
.root > div:last-child {
  margin-bottom: 0;
}
</style>

<style scoped>
h2 {
  margin-bottom: 1em;
}
</style>

<style>
.form {
  display: flex;
  flex-wrap: wrap;
}
.form-item {
  margin-right: 1em;
}
.form-item:last-child {
  margin-right: 0;
}
h3, p {
  margin-bottom: 0.5em;
}
.markdown-body {
  font-size: 100%;
}
</style>
