import test from 'tape'
import {createAction} from 'redux-actions'
import boot, {BOOT} from '../src/lib/bootstrap'


test('Use redux-actions with redux-promise to fire async side-effect actions in middlewares', assert => {

  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'
  const AFTER_AFTER_BOOT = 'choko/core/test/AFTER_AFTER_BOOT'

  // Mocking an API.
  let data = {
    1: 'bar',
    2: 'baz',
    3: 'rock'
  }

  const someApi = {
    get(id) {
      return Promise.resolve({
        name: data[id]
      })
    }
  }

  // Asynchronous side-effect action.
  const afterBootAction = createAction(AFTER_BOOT, async id => {

    // Geting something from an API.
    const result = await someApi.get(id)
    return result
  })

  // Synchronous side-effect action.
  const afterAfterBootAction = createAction(AFTER_AFTER_BOOT)

  const initialState = {
    foo: 'bar'
  }

  // Module with async side-effect.
  const testAsyncModule = {

    reducer: {
      // Reaction to after boot side-effect.
      [AFTER_BOOT]: (state, action) => {
        assert.pass('Reducer called by an "after boot" side-effect')

        return {
          ...state,
          foo: action.payload
        }
      }
    },

    middleware({getState, dispatch}) {
      // Note the async keyword.
      return next => async action => {
        let nextResult = next(action)

        // Reaction to the boostrap action.
        if (action.type === BOOT) {
          assert.pass('Middleware called at bootstrap action')

          // Dispatch after boot side-effects.
          const sideEffect = await dispatch(afterBootAction(3))

          assert.equal(
            getState().foo.name,
            'rock',
            'Async "after boot" side-effect was handled'
          )
        }

        return nextResult
      }
    }
  }

  // Module with sync side-effect.
  const testSyncModule = {
    reducer: {
      [AFTER_AFTER_BOOT]: (state, action) => {
        assert.pass('Reducer called by an "after, after boot" side-effect')

        return {
          ...state,
          afterAfterBoot: true
        }
      }
    },
    middleware({getState, dispatch}) {
      return next => action => {

        let nextResult = next(action)

        if (action.type === AFTER_BOOT) {
          assert.pass('Middleware called by side-effect')

          // Sync side-effect action is fully dispatched.
          const sideEffect = dispatch(afterAfterBootAction())
        }

        if (action.type == AFTER_AFTER_BOOT) {
          assert.pass('Middleware of sync module reacted to an "after, after boot" side-effect')
        }

        return nextResult
      }
    }
  }

  const modules = [
    testAsyncModule,
    testSyncModule
  ]

  const app = boot(initialState, modules)

  app.then(({action, store}) => {

    assert.ok(
      store.getState().afterAfterBoot,
      'After after side-effect was handled'
    )

    assert.equal(
      store.getState().foo.name,
      'rock',
      'Async bootstrap and all theirs side-effects were handled'
    )

    assert.end()
  })
})
