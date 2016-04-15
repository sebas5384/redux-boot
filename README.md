# Redux Boot

[![Build Status](https://travis-ci.org/choko-org/redux-boot.svg?branch=master)](https://travis-ci.org/choko-org/redux-boot)

> An **experimental** next generation Redux Boot server based on [Redux](http://redux.js.org).

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

**Example**

```js
import boot, {BOOT} from 'redux-boot'

const initialState = {
  foo: 'bar'
}

const testModule = {
  reducer(state, action) {
    if (action.type === BOOT) {
      return {
        ...state,
        foo: 'baz'
      }
    }
    return state
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

Soon ... but for now see the [bootstrap tests](https://github.com/choko-org/redux-boot/blob/master/test/bootstrap.test.js#L67-L123).

## License

GNU General Public License (GPL) version 3.
