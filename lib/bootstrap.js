import {createStore, applyMiddleware} from 'redux'
import {createAction, handleActions} from 'redux-actions'
import promiseMiddleware from 'redux-promise'
import combineReducers from './combine-reducers'

export const BOOT = 'choko/core/BOOT'

export default function bootstrap(initialState = {}, modules = []) {

  const reducersFromModules = modules
    .filter(module => (
      typeof module.reducer == 'function' || typeof module.reducer == 'object'
    ))
    .map(module => (
      typeof module.reducer == 'function' ? module.reducer : handleActions(module.reducer)
    ))

  let middlewaresFromModules = modules
    .filter(module => typeof module.middleware == 'function')
    .map(module => module.middleware)

  middlewaresFromModules.unshift(promiseMiddleware)

  const rootReducer = combineReducers(reducersFromModules)

  let store = createStore(rootReducer, initialState, applyMiddleware(...middlewaresFromModules))

  store.dispatch(bootAction())

  return {
    store
  }
}

export const bootAction = createAction(BOOT)
