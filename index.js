import {createStore, applyMiddleware} from 'redux'
import {createAction} from 'redux-actions'

import combineReducers from './lib/combine-reducers'

// Import Choko Core modules.
import WebServerModule from './modules/web-server/main'

//
// REDUX APP.
// 

const combineReducers = (reducers) => {
  return (currentState, action) => {
    const state = reducers.reduce(
      (prevState, reducer) => reducer(prevState, action),
      currentState
    )

    return state
  }
}

export const BOOT = 'choko/core/BOOT'

// CREATOR OF CHOKO APP.
export default function ChokoApp(initialState = {}, initialModules = []) {

  //
  // MODULES.
  //

  let modules = [
    // Core modules.
    WebServerModule,
    ...initialModules
  ]

  const reducersFromModules = modules
    .filter(module => typeof module.reducer == 'function')
    .map(module => module.reducer)

  const middlewaresFromModules = modules
    .filter(module => typeof module.middleware == 'function')
    .map(module => module.middleware)

  const rootReducer = combineReducers(reducersFromModules)

  let store = createStore(rootReducer, initialState, applyMiddleware(...middlewaresFromModules))
  let syncDispatcher = store.dispatch
  
  store.dispatch = (...theArgs) => {
    return syncDispatcher(...theArgs)
  }

  store.dispatch({type: BOOT})

  return {
    store
  }
}


// --------------------------------------------------

// CUSTOM APLICATION CODE.

// Import Choko Core modules.
// import ChokoApp from 'choko-core'

// Custom modules.
// import reactRouterReducer from 'choko-react-router'
import ReactRouterModule from './modules/react-router/main'
import StaticServerModule from './modules/static-server/main'
import CustomRouterModule from './modules/custom-router/main'

const initialState = {
  variables: {
    name: 'My custom APP'
  }
}


// @TODO: Calculate dependency order by its package.json.
const enabledModules = [
  // ReactRouterModule,
  // CustomRouterModule,
  // StaticServerModule
]

const chokoApp = ChokoApp(initialState, enabledModules)

// console.log(chokoApp.store.getState(), 'FINAL STATE')

// @TODO:
// 1. Immutable-js
// 2. Async
// 3. redux-router
