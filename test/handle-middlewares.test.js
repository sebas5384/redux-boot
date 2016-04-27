import test from 'tape'
import {createAction} from 'redux-actions'
import boot, {BOOT} from '../src/bootstrap'

test('Use handleMiddlewares to handle middleware execution', assert => {
  const AFTER_BOOT = 'redux-boot/test/AFTER_BOOT'

  const afterBootAction = value => {
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

  const reducers = {
    [AFTER_BOOT]: (state, action) => {
      assert.pass('Reducer called')
      return {
        ...state,
        foo: action.payload.foo
      }
    }
  }

  const middlewares = {
    [BOOT]: store => next => action => {
      store.dispatch(afterBootAction('baz'))
      next(action)
    }
  }

  const modules = [
    {
      reducer: reducers,
      middleware: middlewares
    }
  ]

  const app = boot(initialState, modules)

  app.then(({action, store}) => {

    assert.equal(
      store.getState().foo,
      'baz',
      "Module middlewares was handled by handleMiddlewares"
    )

    assert.end()
  })
})
