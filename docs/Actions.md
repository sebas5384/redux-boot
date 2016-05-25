# Actions

If you don't know what actions are you can read the Redux's [documentation](http://redux.js.org/docs/basics/Actions.html).

There are two kinds of actions, synchronous and asynchronous:

## Synchronous

**Vanilla action:**
```js
const LOGIN = 'redux-boot/user/login'

const loginAction = (...args) => ({ type: LOGIN, payload: ...args })
```

**Using [Redux-actions](https://github.com/acdlite/redux-actions):**
```js
import {createAction} from 'redux-actions'

const LOGIN = 'redux-boot/user/login'

const loginAction = createAction(LOGIN)
```

## Asynchronous
**Vanilla action:**
```js
const LOGIN = 'redux-boot/user/LOGIN'

const loginAction = async (...args) => {
  
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => resolve({...args}), 1)
  })
  
  return { type: LOGIN, payload: result }
}
```

**Using [Redux-actions](https://github.com/acdlite/redux-actions):**
```js
import {createAction} from 'redux-actions'

const LOGIN = 'redux-boot/user/LOGIN'

const loginAction = createAction(LOGIN, async (...args) => {

  const result = await new Promise((resolve, reject) => {
    setTimeout(() => resolve(...args), 1)
  })
  
  return result
})
```

Dispatching asynchronous action give us a promise which will be resolved when the action lifecycle is done.


```js

store.dispatch(loginAction(credentials))

```