import test from 'tape'
import {createAction} from 'redux-actions'
import Choko, {BOOT} from '../src/lib/bootstrap'


test('Use redux-actions with redux-promise to fire async side-effect actions in middlewares', (assert) => {

  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'
  const AFTER_AFTER_BOOT = 'choko/core/test/AFTER_AFTER_BOOT'

  const afterAfterBootAction = createAction(AFTER_AFTER_BOOT)

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
    },

    [AFTER_AFTER_BOOT]: (state, action) => {
      assert.pass('Reducer called by another side-effect')

      return {
        ...state,
        foo: 'wat'
      }
    }

  }

  const testModule = {

    // Less boilerplating.
    reducer: handlers,

    middleware({getState, dispatch}) {
      // Note the async keyword.
      return next => async (action) => {
        let result = next(action)

        if (action.type === BOOT) {
          assert.pass('Middleware called with BOOT')

          // Async side-effect actions
          // is fully dispatched.
          const sideEffect = await dispatch(afterBootAction('foo'))

          assert.equal(
            getState().foo,
            'wat',
            "Async side-effect was handled"
          )
        }

        if (action.type === AFTER_BOOT) {
          assert.pass('Middleware called by side-effect')

          // Async side-effect actions
          // is fully dispatched.
          const sideEffect = await dispatch(afterAfterBootAction())
        }

        return result
      }
    }

  }

  const modules = [
    testModule
  ]

  const app = Choko(initialState, modules)

  app.then(({action, store}) => {
    
    assert.equal(
      store.getState().foo,
      'wat',
      "Async bootstrap and all theirs side-effects were handled"
    )

    assert.end()
  })
})
