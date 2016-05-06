# Reducers

Modules can implement a reducer. A reducer is a function that receives the current state and the action object, and returns the new state.

A reducer is a pure function, this means it should do just one thing and it must be synchronous. Below is the simplest way of implementing a reducer:

```js
const SAY_HELLO = 'mymodule/SAY_HELLO'
const mymodule = {
  reducer(state, action) {
    if (action.type == SAY_HELLO) {
      return {
        ...state,
        data: 'Hello World'
      }
    }
    return state
  }
}
```
To reduce the need for multiple `if` or `switch` blocks you can use an object instead of a function for the reducer. This way you have multiple **action handlers** for each of the actions you want to listen to.

```js
const SAY_HELLO = 'mymodule/SAY_HELLO'
const mymodule = {
  reducer: {
    [SAY_HELLO]: (state, action) => {
      return {
        ...state,
        data: 'Hello World'
      }
    }
  }
}
```

In the example above, the reducer object is passed to [redux-actions](https://github.com/acdlite/redux-actions) and then it's transformed to a single reducer. This removes the need to have control flow structures inside the reducer.