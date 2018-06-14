<template>
  <row>
    <i-col span="10" class="left">
      <affix>
        <div class="button">
          <button-group shape="circle">
            <i-button icon="arrow-up-b" :disabled="isFirstEvent" @click="moveActiveEvent(-1)"></i-button>
            <i-button icon="arrow-down-b" :disabled="isLastEvent" @click="moveActiveEvent(1)"></i-button>
          </button-group>
        </div>
      </affix>
      <event-timeline></event-timeline>
    </i-col>
    <i-col span="14" class="right">
      <affix>
        <tabs>
          <tab-pane label="Property">
            <property></property>
          </tab-pane>
          <tab-pane label="Attributions">
            <attributions></attributions>
          </tab-pane>
        </tabs>
      </affix>
    </i-col>
  </row>
</template>

<script>
import EventTimeline from './EventTimeline'
import Property from './Property'
import Attributions from './Attributions'
import { Row, Col, Tabs, TabPane, Affix, Button, ButtonGroup } from 'iview'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Viewer',
  components: {
    EventTimeline,
    Property,
    Attributions,
    Row,
    'i-col': Col,
    Tabs,
    TabPane,
    Affix,
    'i-button': Button,
    ButtonGroup
  },
  computed: mapGetters(['isLastEvent', 'isFirstEvent']),
  methods: mapMutations(['moveActiveEvent'])
}
</script>

<style scoped>
.left {
  border-right: 1px solid #ddd;
}
.right {
  padding-left: 2em;
}
.button {
  float: right;
  margin-right: 1em;
}
</style>
