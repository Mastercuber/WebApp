import test from 'ava'
import { shallowMount } from '@vue/test-utils'
import Icon from '../../../../../components/Global/Elements/Icon/Icon'

test('It should render an `<i>`.', (t) => {
  const wrapper = shallowMount(Icon)

  t.true(wrapper.is('i'))
})
