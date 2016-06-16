# Reducers

A [reducer](http://redux.js.org/docs/basics/Reducers.html) is a function that receives the current state and an action, and returns the new state.

A reducer is a pure function, this means it should always return the same values whenever the same arguments are passed. So it can't depend on any external resource that can interfere in its return, like reading from a database. This also means that no side-effect, like updating the database, can be made in reducers.

From the Redux's docs, these are some of the things you should never do inside a reducer:

* Mutate its arguments;
* Perform side effects like API calls and routing transitions;
* Call non-pure functions, e.g. Date.now() or Math.random().

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

To avoid the need for multiple `if` or `switch` statements you can use an object instead of a function for the reducer. This way you have multiple action handlers, one for each of the actions you want to listen to.

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

In the example above, the reducer object is passed to [redux-actions](https://github.com/acdlite/redux-actions) and then it's transformed into a single reducer. This removes the need to have control flow structures inside the reducer.