export default function combineReducers(reducers) {
  return (currentState, action) => {
    const state = reducers.reduce(
      (prevState, reducer) => reducer(prevState, action),
      currentState
    )


    return state
  }
}
