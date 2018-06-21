<template>
  <div>
    <h3>Event Timeline</h3>
    <timeline v-if="eventsByTime.length">
      <timeline-item v-for="groupedEvent in eventsByTime" :key="groupedEvent.time.valueOf()">
        {{ groupedEvent.time.format('YYYY-MM-DD HH:mm:ss') }}
        <ul class="content">
          <li v-for="(event, index) in groupedEvent.events" :key="index">
            <event v-bind="event"></event>
          </li>
        </ul>
        <duration-spacer :seconds="groupedEvent.diff"></duration-spacer>
      </timeline-item>
    </timeline>
    <p v-else>
      No events found.
    </p>
  </div>
</template>

<script>
import Event from './Event'
import DurationSpacer from './DurationSpacer'
import { Timeline, TimelineItem } from 'iview'
import { mapGetters } from 'vuex'
export default {
  name: 'EventTimeline',
  components: {
    Timeline, TimelineItem, Event, DurationSpacer
  },
  computed: mapGetters(['eventsByTime'])
}
</script>

<style scoped>
li {
  list-style-position: inside;
}
h3 {
  margin-bottom: 1em;
}
</style>

<style>
.ivu-timeline-item {
  padding-bottom: 0;
}
.ivu-timeline-item-content {
  padding-bottom: 1px;
}
</style>
