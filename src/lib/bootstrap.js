import {createStore, applyMiddleware} from 'redux'
import {createAction} from 'redux-actions'
import promiseMiddleware from 'redux-promise'
import combineReducers from './combine-reducers'
import processModules from './process-modules'

export const BOOT = 'choko/core/BOOT'

export default function bootstrap(initialState = {}, modules = []) {
  const {reducersFromModules, middlewaresFromModules} = processModules(modules)

  // Creates the root middleware and adds redux-promise middleware.
  const rootMiddleware = [promiseMiddleware].concat(middlewaresFromModules)

  const rootReducer = combineReducers(reducersFromModules)

  let store = createStore(rootReducer, initialState, applyMiddleware(...rootMiddleware))

  const bootPromise = store.dispatch(bootAction(initialState))

  return bootPromise.then(action => {
    return {
      action,
      store
    }
  })
}

export const bootAction = createAction(BOOT, async initialState => initialState)
