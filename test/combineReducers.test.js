import test from 'tape'
import combineReducers from '../src/combineReducers'

test('Combine reducers without using scoped states', assert => {

  const AFTER_BOOT_ACTION = 'redux-boot/test/AFTER_BOOT_ACTION'

  const afterBootAction = () => ({type: AFTER_BOOT_ACTION})

  const reducerMock = letter => (state, action) => {
    if (action.type == AFTER_BOOT_ACTION) {
      return {
        ...state,
        foo: letter
      }
    }

    return state
  }

  const reducers = [
    reducerMock('A'),
    reducerMock('B'),
    reducerMock('C'),
    reducerMock('D')
  ]

  const initialState = {
    foo: 'bar'
  }

  const finalState = combineReducers(reducers)(initialState, afterBootAction())

  assert.looseEqual(
    finalState,
    {foo: 'D'},
    'The chain of reducers were executed'
  )

  assert.end()
})