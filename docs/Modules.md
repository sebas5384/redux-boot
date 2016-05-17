# Modules

A module is made of a reducer and/or a middleware and assumes the actions are [FSA](https://github.com/acdlite/flux-standard-action) compliant.

Its **basic signature** is the following:

```js
const module = {

  reducer: (state, action) => {

  },
  
  middleware: store => next => action => {

  }
  
}
```
---
Using[ **redux-actions**](https://github.com/acdlite/redux-actions) and **middleware handlers** signature:
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
---
Using[ **redux-actions**](https://github.com/acdlite/redux-actions) and[ **redux-promise**](https://github.com/acdlite/redux-promise) signature:
```js
import {BOOT} from 'redux-boot';
import {createAction} from 'redux-actions';
import parseRoutesFiles from './parseRoutesFiles';

const LOAD_ROUTES = 'redux-boot/routes/LOAD';
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
---
## Standard signature of a module file

`@file: /modules/user/index.js`
```js
// Notice we don't use the ";".

import {BOOT} from 'redux-boot'
import {createAction} from 'redux-actions'

// Use an action constant type from other module.
// Notice the path is relative, we assume you use Webpack.
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

  }

}
```