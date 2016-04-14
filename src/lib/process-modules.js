import {handleActions} from 'redux-actions'

export default function processModules(modules) {
  const reducers = modules
    .filter(module => (
      typeof module.reducer == 'function' || typeof module.reducer == 'object'
    ))
    .map(module => (
      typeof module.reducer == 'function' ? module.reducer : handleActions(module.reducer)
    ))

  const middlewares = modules
    .filter(module => typeof module.middleware == 'function')
    .map(module => module.middleware)

  return {
    reducers,
    middlewares
  }
}
