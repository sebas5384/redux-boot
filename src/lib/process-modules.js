import {handleActions} from 'redux-actions'

export default function processModules(modules) {
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

  return {
    reducersFromModules,
    middlewaresFromModules
  }
}
