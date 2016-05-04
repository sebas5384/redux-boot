# Basics

## Modules

A module is made of a reducer and/or a middleware. Its basic signature is the following:

```js
{
  reducer: (state, action) => {

  },

  middleware: store => next => action => {

  }
}
```

## Reducers

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

## Middlewares

Middlewares are used when you want to do anything more than just change the state. It can be used to dispatch asynchronous actions for e.g. to load external data or perform a side-effect in the application.

```js
const API_REQUEST = 'mymodule/REQUEST'
const mymodule = {
  middleware(store) {
    return next => action => {

      if (action.type == API_REQUEST) {
        console.log(action.payload.body, 'Api request')
      }

      return next(action)
    }
  }
}
```

Just like you can do with reducers, you can also use an object for the middlewares when you want to listen to a single or multiple action types.

```js
const API_REQUEST = 'mymodule/REQUEST'
const mymodule = {
  [API_REQUEST]: store => next => action => {
    console.log(action.payload.body, 'Api request')
    return next(action)
  }
}
```

You can check Redux documentation for a more detailed documentation about Redux's [reducers](http://redux.js.org/docs/basics/Reducers.html) and [middlewares](http://redux.js.org/docs/advanced/Middleware.html).