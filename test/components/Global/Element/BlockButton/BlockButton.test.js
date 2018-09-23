import test from 'ava'
import { shallowMount, mount } from '@vue/test-utils'
import { render } from '@vue/server-test-utils'
import BlockButton from '../../../../../components/Global/Elements/BlockButton/BlockButton'

const entity = { id: 42 }
const currentUser = { id: 47 }
const toggleBlacklist = () => {}

test('It renders a `<div>`.', (t) => {
  const entity = { id: 42 }
  const wrapper = shallowMount(BlockButton, {
    mocks: { $t: () => {} },
    props: {entity, currentUser, toggleBlacklist}
  })

  t.true(wrapper.is('div'))
})

test('shows a button, when currentUser !== entity', (t) => {
  const wrapper = mount(BlockButton, {
    mocks: { $t: () => {} },
    props: {entity, currentUser, toggleBlacklist}
  })

  t.truthy(wrapper.contains('i'))
})
