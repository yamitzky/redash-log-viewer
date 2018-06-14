<template>
  <div>
      {{ title }}:
      <span v-if="type.startsWith('date')">
        <date-picker :type="type === 'date' ? 'date' : 'datetime'" class="input" :value="dateValue" @input="updateQueryParamValue({ name, value: $event })"></date-picker>
      </span>
      <span v-else-if="type === 'enum'">
        <i-select class="input" :value="value" @input="updateQueryParamValue({ name, value: $event })">
          <i-option v-for="option in enumOptions" :value="option" :key="option">{{ option }}</i-option>
        </i-select>
      </span>
      <span v-else-if="type === 'number'">
        <input-number class="input" :value="value" @input="updateQueryParamValue({ name, value: $event })"></input-number>
      </span>
      <span v-else>
        <i-input type="text" class="input" :value="value" @input="updateQueryParamValue({ name, value: $event })"></i-input>
      </span>
  </div>
</template>

<script>
import { DatePicker, Select, Option, Input, InputNumber } from 'iview'
import { mapMutations } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'QueryParam',
  props: ['type', 'name', 'value', 'title', 'enumOptions'],
  components: {
    DatePicker,
    InputNumber,
    'i-select': Select,
    'i-option': Option,
    'i-input': Input
  },
  methods: mapMutations(['updateQueryParamValue']),
  computed: {
    dateValue () {
      if (this.value && this.value !== '') {
        return dayjs(this.value).toDate()
      }
    }
  }
}
</script>

<style scoped>
.input {
  width: 10em;
}
</style>
