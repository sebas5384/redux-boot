# Modules

A module implements a [reducer](Reducers.md) and/or a [middleware](Middlewares.md). They should deal with a standard [Redux's store](http://redux.js.org/docs/api/Store.html) and assume all actions are [FSA](https://github.com/acdlite/flux-standard-action) compliant. Modules can also implement a [store enhancer](http://redux.js.org/docs/Glossary.html#store-enhancer).

The basic module structure is the following:

```js
const module = {

  reducer: (state, action) => {
    return state
  },
  
  middleware: store => next => action => {
    return next(action)
  },
  
  enhancer: createStore => (reducer, initialState, enhancer) => {
    return createStore(reducer, initialState, enhancer)
  }
  
}
```

For convenience and better code readability, the reducer can also be an object. If so, it's meant to be a [redux-actions](https://github.com/acdlite/redux-actions)' action handler object. Redux Boot also provides middleware handlers which are like redux-actions action handlers but for middlewares:

```js
import boot, {BOOT} from 'redux-boot'

const module = {
  
  reducer: {
    
    // React to an action and change the state.
    [BOOT]: (state, action) => {
      return {
        ...state,
        status: 'online'
      }
    }
  
  },
  
  middleware: {

    // React to an action before or after is done,
    // and execute side effects, like other actions.
    [BOOT]: store => next => action => {    
      // Do side effects here.
      return next(action)
    }

  }
  
}
```

This is useful to avoid deeply nested `switch` and `if` statements that can have a bad impact in code readability and simplicity. By using objects, reducers and middlewares can respond to specific action types.


Using[ **redux-actions**](https://github.com/acdlite/redux-actions) and[ **redux-promise**](https://github.com/acdlite/redux-promise) signature:

[//]: # (Move this to advanced?)

```js
import {BOOT} from 'redux-boot'
import {createAction} from 'redux-actions'
import parseRoutesFiles from './parseRoutesFiles'

const LOAD_ROUTES = 'redux-boot/routes/LOAD'
const loadRoutesAction = createAction(LOAD_ROUTES, async () => {

  // parseRoutesFiles returns a promise, so its an async function.
  const routes = await parseRoutesFiles()
  
  return {
    routes
  }
})

const module = {
  
  reducer: {

    [LOAD_ROUTES]: {
      next: (state, action) => {
        // Parsing the route files was a success.
        return {
          ...state,
          routes: action.payload.routes
        }
      },
      throw: (state, action) => {
        // oh no! something went wrong.
        return {
          ...state,
          routes: "Can't parse the route files."
        }
      }

    }

  },

  middleware: {

    // React to the bootstrap stage / action of redux-boot.
    // Use the "async" keyword inside middleware.
    [BOOT]: ({dispatch, getState}) => next => async action => {

      // Continue the middlewares flow.
      const nextResult = next(action)

      // Dispatch async action.
      await dispatch(loadRoutesAction())

      // Get loaded routes.
      const routes = getState().routes

      return nextResult
    }

  }

}
```

## Module file basic structure

[//]: # (Add link to code style?)

```js
import {BOOT} from 'redux-boot'
import {createAction} from 'redux-actions'

// Use an action constant type from other module.
// Notice the path is relative, we assume we are using Webpack.
import {SUBMIT_FORM} from 'modules/forms'

// Exporting "export" an action means its public to use it outside
// from this module's reducers and middlewares.

// Notice the name space of the action type.
// redux-boot -> Is default.
// user       -> Module name space.
// LOGIN      -> The last should be the actual action verb
//               and in uppercase.

// Public.
export const LOGIN = 'redux-boot/user/LOGIN'

// Private, you shouldn't use it out side the module.
const loginAction = createAction(LOGIN)

export default {
  
  reducer: {

    [SUBMIT_FORM]: (state, action) => {

      const formData = action.payload

      if (formData.type === 'login') {

        return {
          ...state,
          formLoginFields: formData.fields
        }
      }

      return state
    }

  },

  middleware: {

    // Use the async keyword inside middleware.
    [SUBMIT_FORM]: ({dispatch, getState}) => next => async action => {

      // Don't lock the cycle.
      const nextResult = next(action)

      // Dispatch async action.
      const loginData = getState().formLoginFields
      await dispatch(loginAction(loginData))

      // Always return the main action.
      return nextResult
    }

  },
  
  enhancer: createStore => (reducer, initialState, enhancer) => {
    // Create new store and create your enhancer here.
    const store = createStore(reducer, initialState, enhancer)
    
    return store
  }

}
```