import test from 'ava'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Comments from '../components/Comments/Comments.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()
let store

test.beforeEach(() => {
  const getters = {
    'auth/user': () => { return {} },
    'comments/all': () => [],
    'comments/count': () => 0,
    'comments/isLoading': () => false
  }
  const actions = {
    'comments/fetchByContributionId': () => [],
    'comments/subscribe': () => {}
  }
  store = new Vuex.Store({
    getters,
    actions
  })
})

test('lol', t => {
  const wrapper = shallowMount(Comments, {
    store,
    localVue,
    propsData: {
      post: {}
    },
    comments: [],
    router})
  t.true(wrapper.is('div'))
})
