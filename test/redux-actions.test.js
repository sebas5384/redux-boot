import test from 'tape'
import {createAction} from 'redux-actions'
import Choko, {BOOT} from '../src/lib/bootstrap'


test('Use redux-actions handlers instead of pure Redux reducers', (assert) => {
  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'

  const afterBootAction = (value) => {
    return {
      type: AFTER_BOOT,
      payload: {
        foo: value
      }
    }
  }

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
      return next => (action) => {

        if (action.type === BOOT) {
          assert.pass('Middleware called')
          dispatch(afterBootAction('baz'))
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
    "Module reducer was handled by redux-actions"
  )

  assert.end()
})

test('Use redux-actions action helper instead of a pure function', (assert) => {
  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'

  const afterBootAction = createAction(AFTER_BOOT, (value) => {
    return {
      foo: value
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
      return next => (action) => {

        if (action.type === BOOT) {
          assert.pass('Middleware called')
          dispatch(afterBootAction('baz'))
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
    "Module action was handled by redux-actions"
  )

  assert.end()
})