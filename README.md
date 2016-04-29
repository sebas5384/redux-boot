# Redux Boot

Modular [Redux](http://redux.js.org) bootstrap with asynchronous side-effects.

[![Build Status](https://travis-ci.org/choko-org/redux-boot.svg?branch=master)](https://travis-ci.org/choko-org/redux-boot)

## What is Redux Boot?

Minimal Framework using [Redux](http://redux.js.org) to develop modularized universal (backend and frontend) applications, based on functional programming paradigms and friends such as Map and Reduce, Immutability and Reactive programming.

 > "Simplicity is the ultimate sophistication."
 > -- Leonardo da Vinci

## What Redux Boot provides?

- **Module API** - Clean **organization and reuse patterns** for your code.
- **Async side-effects** - **No-brainer** async side-effects with [redux-actions](https://github.com/acdlite/redux-actions) and [redux-promise](https://github.com/acdlite/redux-promise).

## Getting started

**Install**

```sh
npm install redux-boot
```

**Basic Usage**

```js
import boot, {BOOT} from 'redux-boot'

const initialState = {
  foo: 'bar'
}

const testModule = {
  reducer: {  
    [BOOT]: (state, action) => {
      return {
        ...state,
        foo: 'baz'
      }
    }
  }
}

const modules = [
  testModule
]

const app = boot(initialState, modules)

app.then(({action, store}) => {

  // Should print 'baz'.
  console.log(store.getState().foo)

})
```

**Sync middleware (with redux-actions)**

```js
import boot, {BOOT} from 'redux-boot'
import {createAction} from 'redux-actions'

const CHANGE_FOO = 'redux-boot/test/CHANGE_FOO'

const changeFoo = createAction(CHANGE_FOO)

const initialState = {
  foo: 'bar'
}

const testModule = {
  reducer: {
    [CHANGE_FOO]: (state, action) => {
      return {
        ...state,
        foo: action.payload
      }
    }
  },

  middleware: {
    [BOOT]: store => next => action => {
      store.dispatch(changeFoo('baz'))
      return next(action)
    }
  }
}

const modules = [
  testModule
]

const app = boot(initialState, modules)

app.then(({action, store}) => {

  // Should print 'baz'.
  console.log(store.getState().foo)
})
```

### Development setup:

**Install**

```sh
git clone https://github.com/choko-org/redux-boot.git
npm install
```

**Build**

```sh
npm run build
```

**Build and Run the tests**

```sh
npm test
```

## Examples:

- The [bootstrap tests](https://github.com/choko-org/redux-boot/blob/master/test/bootstrap.test.js).
- Simple [web server App](https://github.com/choko-org/redux-boot-web-app-example)


## License

GNU General Public License (GPL) version 3.
