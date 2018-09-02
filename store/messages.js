import { castArray, debounce } from 'lodash'

export const state = () => {
  return {
    messages: [],
    isLoading: false
  }
}

export const mutations = {
  isLoading (state, status) {
    state.isLoading = status
  },
  set (state, messages) {
    state.messages = castArray(messages)
  },
  clear (state) {
    state.messages = []
  }
}

export const getters = {
  all (state) {
    return state.messages
  },
  isLoading (state) {
    return state.isLoading
  },
  count (state) {
    return state.messages.length
  }
}

export const actions = {
  fetch ({dispatch, commit}) {
    commit('isLoading', true)
    //this.app.$api.on('messages created', (res) => {console.log('RES: ' + JSON.stringify(res, null, 2))});
    return this.app.$api.service('messages').find()
      .then((result) => {
        commit('set', result.data)
        commit('isLoading', false)
      })
      .catch((e) => {
        commit('isLoading', false)
      })
  },
  create ({dispatch}, data) {
    return this.app.$api.service('messages').create(data)
  },
  patch ({dispatch}, data) {
    return this.app.$api.service('messages').patch(data._id, data)
  },
  remove ({dispatch}, id) {
    return this.app.$api.service('messages').remove(id)
  }
}
