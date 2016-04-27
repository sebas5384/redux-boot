import {createStore, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise'
import combineReducers from './combineReducers'

export default function configureStore(initialState, reducers, middlewares) {

  const rootMiddleware = [promiseMiddleware].concat(middlewares)
  const rootReducer = combineReducers(reducers)

  return createStore(rootReducer, initialState, applyMiddleware(...rootMiddleware))
}
