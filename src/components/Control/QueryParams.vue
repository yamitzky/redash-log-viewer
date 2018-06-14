<template>
  <div>
    <h3>Query Parameters <i-button icon="refresh" size="small" @click="fetchQuery"></i-button></h3>
    <div class="form">
      <div v-for="param in queryParams" :key="param.name" class="form-item">
        <query-param v-bind="param"></query-param>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Icon, Button } from 'iview'
import QueryParam from './QueryParam'
export default {
  name: 'QueryParams',
  computed: {
    ...mapGetters(['queryParams'])
  },
  methods: mapActions(['fetchQuery']),
  components: {
    QueryParam,
    Icon,
    'i-button': Button
  }
}
</script>
