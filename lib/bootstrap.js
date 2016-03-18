import {createStore, applyMiddleware} from 'redux'
import {createAction, handleActions} from 'redux-actions'
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

  const middlewaresFromModules = modules
    .filter(module => typeof module.middleware == 'function')
    .map(module => module.middleware)

  const rootReducer = combineReducers(reducersFromModules)

  let store = createStore(rootReducer, initialState, applyMiddleware(...middlewaresFromModules))
  let syncDispatcher = store.dispatch

  store.dispatch = (...theArgs) => {
    return syncDispatcher(...theArgs)
  }

  store.dispatch(bootAction())

  return {
    store
  }
}

export const bootAction = createAction(BOOT)
