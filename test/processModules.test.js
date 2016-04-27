import test from 'tape'
import {BOOT} from '../src/bootstrap'
import processModules, {handleMiddlewares} from '../src/processModules'

test('Process modules with middlewares and reducers', assert => {

  const reducerMock = (state, action) => state
  const middlewareMock = store => next => action => next(action)

  const moduleMock = () => ({
    reducer: reducerMock,
    middleware: middlewareMock
  })

  const modules = [
    moduleMock(),
    moduleMock(),
    moduleMock()
  ]

  const modulesProcessed = processModules(modules)

  assert.looseEqual(
    modulesProcessed.reducers,
    [reducerMock, reducerMock, reducerMock],
    'Reducers were collected'
  )

  assert.looseEqual(
    modulesProcessed.middlewares,
    [middlewareMock, middlewareMock, middlewareMock],
    'Middlewares were collected'
  )

  assert.end()
})

test('Process modules with reducers using actions handler from redux-actions', assert => {

  const reducerMock = (state, action) => state

  const moduleMock = () => ({
    reducer: {
      'TEST_A': reducerMock,
      'TEST_B': reducerMock
    }
  })

  const modules = [
    moduleMock(),
    moduleMock(),
    moduleMock()
  ]

  const modulesProcessed = processModules(modules)

  assert.looseEqual(
    modulesProcessed.reducers.map(val => typeof val),
    ['function', 'function', 'function'],
    'Reducers handlers were collected'
  )

  assert.end()
})

test('Process modules with middlewares using a handler from redux-boot', assert => {

  const middlewareMock = store => next => action => next(action)

  const moduleMock = () => ({
    middleware: {
      'TEST_A': middlewareMock,
      'TEST_B': middlewareMock
    }
  })

  const modules = [
    moduleMock(),
    moduleMock(),
    moduleMock()
  ]

  const modulesProcessed = processModules(modules)

  assert.looseEqual(
    modulesProcessed.middlewares.map(val => typeof val),
    ['function', 'function', 'function'],
    'Middleware handlers were collected'
  )

  assert.end()
})

test('Handle middleware listeners to actions', assert => {

  const TEST_A = 'redux-boot/test/TEST_A'
  const TEST_B = 'redux-boot/test/TEST_B'

  const testAAction = () => ({type: TEST_A})

  const listenerMock = store => next => action => {

    if (action.type == TEST_A) {

      assert.equal(
        action.type,
        TEST_A,
       'Middleware listener was called for action TEST_A'
      )
    }

    return next(action)
  }

  const listeners = {
    [TEST_A]: listenerMock,
    [TEST_B]: listenerMock
  }

  const store = {}
  const next = (action) => action

  const middlewareHandled = handleMiddlewares(listeners)(store)(next)(testAAction())

  assert.looseEqual(
    middlewareHandled,
    testAAction(),
    'Middleware listener were called and processed by the middlewareHandler'
  )

  assert.end()
})
