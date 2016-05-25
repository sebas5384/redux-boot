# Actions

If you don't know what actions are you can read the Redux's [documentation](http://redux.js.org/docs/basics/Actions.html).

There are two kinds of actions, synchronous and asynchronous:

## Synchronous

**Vanilla action:**
```js
const LOGIN = 'redux-boot/user/login'

conts login = {
  type: LOGIN,
  payload: {
    username: 'recidive',
    password: '*****'
  }
}

```

**Using [Redux-actions](https://github.com/acdlite/redux-actions) action:**
```js

```