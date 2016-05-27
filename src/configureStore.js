import {createStore, applyMiddleware, compose} from 'redux'
import promiseMiddleware from 'redux-promise'
import combineReducers from './combineReducers'

export default function configureStore(initialState, reducers, middlewares, enhancers) {

  const rootReducer = combineReducers(reducers)
  const rootMiddleware = [promiseMiddleware].concat(middlewares)
  const rootEnhancers = compose(
    applyMiddleware(...rootMiddleware),
    ...enhancers
  )

  return createStore(rootReducer, initialState, rootEnhancers)
}
