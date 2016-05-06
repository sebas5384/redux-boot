# Middlewares
Middlewares are used when you want to do anything more than just change the state. It can be used to dispatch asynchronous actions for e.g. to load external data or perform a *side-effect* in the application.

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
