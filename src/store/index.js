import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'
import _ from 'lodash'
import router from '@/router'
import axios from 'axios'
import sleep from 'await-sleep'

Vue.use(Vuex)

const urlStoragePlugin = (router, { serializer, deserializer }) => {
  return store => {
    let loaded = false
    store.subscribe((mutation, state) => {
      if (!loaded && mutation.type === 'route/ROUTE_CHANGED') {
        store.replaceState({ ...state, ...deserializer(mutation.payload.to.query) })
        loaded = true
      } else {
        router.replace({ query: { ...state.route.query, ...serializer(state) } })
      }
    })
  }
}

export default new Vuex.Store({
  state: {
    queryParamValues: {},
    activeEventIndex: 0,
    query: {},
    queryResult: {},
    error: '',
    pollingStartedAt: null,
    lastPolledAt: null
  },
  getters: {
    queryParams (state) {
      const params = (state.query.options || {}).parameters || []
      return params.map(param => {
        const value = state.queryParamValues[param.name]
        const result = { ...param, value }
        if (param.enumOptions) {
          result.enumOptions = param.enumOptions.split('\n')
        }
        return result
      })
    },
    queryParamsFilled (state) {
      return Object.values(state.queryParamValues).every(v => v !== '')
    },
    executable (state, getters) {
      return getters.queryParamsFilled && !state.pollingStartedAt && !state.lastPolledAt
    },
    queryResultFetched (state) {
      return !!Object.keys(state.queryResult).length
    },
    events (state) {
      if (!state.queryResult.data) {
        return []
      }
      return state.queryResult.data.rows.map(row => {
        const cols = state.queryResult.data.columns
          .filter(col => col.name !== 'time' && col.name !== 'event' && col.name !== 'property' && col.name !== 'subevent')
          .map(col => col.name)
        let property = row.property
        try {
          property = JSON.parse(property)
        } catch (e) {
          // compatibility for non-JSON property
          property = { property }
        }
        return {
          time: dayjs(row.time),
          event: row.event,
          subevent: row.subevent,
          property,
          attributions: cols.map(col => ({ name: col, value: row[col] }))
        }
      })
        .sort((a, b) => a.time.valueOf() - b.time.valueOf())
        .reverse()
        .map((event, i) => ({ ...event, i }))
    },
    eventsByTime (state, getters) {
      if (!getters.events.length) {
        return []
      }
      const grouped = _.groupBy(getters.events, event => event.time.startOf('second').valueOf())
      const groups = Object.keys(grouped).map(key => ({
        time: grouped[key][0].time.startOf('second'),
        events: grouped[key]
      }))
      groups.forEach((group, i) => {
        const next = groups[i + 1]
        if (next) {
          group.diff = group.time.diff(next.time, 'seconds')
        } else {
          group.diff = 0
        }
      })
      return groups
    },
    activeEvent (state, getters) {
      return getters.events[state.activeEventIndex]
    },
    isLastEvent (state, getters) {
      return state.activeEventIndex >= getters.events.length - 1
    },
    isFirstEvent (state) {
      return state.activeEventIndex <= 0
    },
    missingColumns (state) {
      if (state.queryResult.data) {
        const cols = state.queryResult.data.columns.map(col => col.name)
        return ['event', 'time', 'property'].filter(key => !cols.includes(key))
      } else {
        return []
      }
    },
    pollingElapsed (state) {
      if (state.pollingStartedAt && state.lastPolledAt) {
        return state.lastPolledAt.diff(dayjs(state.pollingStartedAt), 'seconds')
      }
    }
  },
  mutations: {
    updateQuery (state, query) {
      state.query = query

      const params = (state.query.options || {}).parameters || []
      for (const param of params) {
        if (!state.queryParamValues[param.name]) {
          Vue.set(state.queryParamValues, param.name, param.value)
        }
      }
    },
    updateQueryParamValue (state, { name, value }) {
      let strValue = value
      if (value instanceof Date) {
        const dj = dayjs(value)
        if (dj.isSame(dj.startOf('date'))) {
          strValue = dj.format('YYYY-MM-DD')
        } else {
          strValue = dj.format()
        }
      }
      Vue.set(state.queryParamValues, name, strValue)
    },
    updateQueryResult (state, queryResult) {
      state.queryResult = queryResult
    },
    updateActiveEventIndex (state, index) {
      state.activeEventIndex = index
    },
    updateError (state, error) {
      state.error = error
    },
    updatePollingStartedAt (state, startedAt) {
      state.pollingStartedAt = startedAt
      state.lastPolledAt = startedAt
    },
    tickPolling (state) {
      state.lastPolledAt = dayjs()
    },
    moveActiveEvent (state, offset) {
      state.activeEventIndex += offset
    }
  },
  actions: {
    async fetchQuery ({ commit, state }) {
      try {
        const { data } = await axios.get(`/api/queries/${state.route.params.queryId}`)
        commit('updateQuery', data)
        commit('updateError')
      } catch (e) {
        commit('updateError', e.message)
      }
    },
    async refreshQueryResult ({ commit, state }) {
      try {
        commit('updateError')
        const { data: { job } } = await axios.post(`/api/queries/${state.route.params.queryId}/refresh`, null, { params: state.route.query })
        commit('updatePollingStartedAt', dayjs())
        const pollJob = async (job) => {
          if (job.status === 3) {
            return job
          } else if (job.status !== 4) {
            await sleep(1000)
            const { data } = await axios.get(`/api/jobs/${job.id}`)
            commit('tickPolling')
            return pollJob(data.job)
          } else {
            throw new Error(job.error)
          }
        }
        const fetchedJob = await pollJob(job)
        const { data: { query_result: queryResult } } = await axios.get(`/api/queries/${state.route.params.queryId}/results/${fetchedJob.query_result_id}.json`)
        commit('updateQueryResult', queryResult)
        commit('updatePollingStartedAt', null)
        commit('updateError')
      } catch (e) {
        commit('updatePollingStartedAt', null)
        commit('updateError', e.message)
      }
    }
  },
  plugins: [
    urlStoragePlugin(router, {
      serializer (state) {
        const result = {}
        for (const key in state.queryParamValues) {
          result[`p_${key}`] = state.queryParamValues[key]
        }
        return result
      },
      deserializer (query) {
        const paramKeys = Object.keys(query).filter(key => key.startsWith('p_'))
        return {
          queryParamValues: _.mapKeys(_.pick(query, paramKeys), (_, key) => key.slice(2))
        }
      }
    })
  ]
})
