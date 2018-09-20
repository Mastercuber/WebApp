import test from 'ava'
import { shallow } from 'vue-test-utils'
import BlockButton from '../../../../../components/Global/Elements/BlockButton/BlockButton'

test('It should render an `<div>`.', (t) => {
  const entity = { id: 42 }
  const wrapper = shallow(BlockButton, {
    props: {entity}
  })

  t.true(wrapper.is('div'))
})
