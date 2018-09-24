import test from 'ava'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { render } from '@vue/server-test-utils'
import Comments from '../components/Comments/Comments.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()
let store

function $t(arg1, arg2) {

}

test.beforeEach(() => {
  const getters = {
    'auth/isVerified': () => true,
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
function shallow(Component, props) {
  return shallowMount(Component, {
    store,
    localVue,
    propsData: props,
    router
  })
}

test('lol', t => {
  /*const m = mount(Comments, {
    store,
    localVue,
    propsData: {
      post: {},
      user: {},
      comments: []
    },
    router
  });*/shallowMount(Component, {
    store,
    localVue,
    propsData: props,
    router
  })

  //console.log('First mount: ' + m.html())

  const wrapper = shallow(Comments, {
    post: {},
    user: {},
    comments: []
  });
  t.true(true);
  console.log(wrapper.html())
  console.log(wrapper.find('#comment-form').vm.childElementCount)
})
