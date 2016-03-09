export default function combineReducers(reducers) {
  return (currentState, action) => {
    const state = reducers
      .reduce((prevState, reducer) => {

        // First reducer is given as prevState.
        if (typeof prevState == 'function') {
          const firstReducer = prevState
          prevState = firstReducer(currentState, action)
        }

        return reducer(prevState, action)
      })

    return state
  }
}
