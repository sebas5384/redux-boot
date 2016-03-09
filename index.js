import {createStore, applyMiddleware} from 'redux'

import combineReducers from './lib/combine-reducers'

// Import Choko Core modules.
import WebServerModule from './modules/web-server/main'

//
// REDUX APP.
//

export const ActionTypes = {
  BOOT: 'choko/core/BOOT'
}

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

  store.dispatch({type: ActionTypes.BOOT})

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
import CustomRouterModule from './modules/custom-router/main'
import StaticServerModule from './modules/static-server/main'

const initialState = {
  variables: {
    name: 'My custom APP'
  }
}

const enabledModules = [
  ReactRouterModule,
  CustomRouterModule,
  StaticServerModule
]

const chokoApp = ChokoApp(initialState, enabledModules)

// console.log(chokoApp.store.getState(), 'FINAL STATE')

// @TODO:
// 1. Immutable-js
// 2. Async
// 3. redux-router
