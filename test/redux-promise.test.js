import test from 'tape'
import {createAction} from 'redux-actions'
import Choko, {BOOT} from '../src/lib/bootstrap'


test('Use redux-actions with redux-promise to fire async side-effect actions in middlwares', (assert) => {
  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'

  const afterBootAction = createAction(AFTER_BOOT, async (id) => {

    // Mocking an Async IO call, like an API fetch.
    const asyncContentFromIO = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === 'foo') {
          resolve('baz')
        }
        else {
          reject('id is not foo')
        }
      }, 1000)
    })

    // Payload of the action.
    return {
      foo: asyncContentFromIO
    }
  })

  const initialState = {
    foo: 'bar'
  }

  // React to an action with less boilerplaing.
  const handlers = {

    [AFTER_BOOT]: (state, action) => {
      assert.pass('Reducer called')

      return {
        ...state,
        foo: action.payload.foo
      }
    }

  }

  const testModule = {

    // Less boilerplating.
    reducer: handlers,

    middleware({getState, dispatch}) {
      // Note the async keyword.
      return next => async (action) => {

        if (action.type === BOOT) {
          assert.pass('Middleware called')

          // Pause till this async side-effect actions
          // is fully dispatched.
          const sideEffect = await dispatch(afterBootAction('foo'))

          console.log(getState(), 'NEW STATE')
        }

        return next(action)
      }
    }

  }

  const modules = [
    testModule
  ]

  const app = Choko(initialState, modules)

  assert.equal(
    app.store.getState().foo,
    'baz',
    "Async side-effect was handled"
  )

  assert.end()
})