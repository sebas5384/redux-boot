# Side Effects

## What?

**From Wikipedia:**
> In computer science, a function or expression is said to have a side effect if it **modifies some state** or has an observable interaction with **calling functions or the outside world.**

**In other words:**

- Changing the value of a variable.
- Writing some data to disk, or any i/o stuff.
- Make a request to an API after submitting a log in form.

Here's an example, logging a user and changing the state to save the user's data.
```js
import api from 'lib/api';

let state = {
  loggedIn: false,
  logging: false,
  user: null,
  session: null
};

const login = (name, pass) => {
  // Use the backend Api to login the user which creates an session.
  const user = api.post('user', {name, pass})
    .then((data) => {
      // Logging proccess is done.
      state.logging = false;
      
      // Logged user is saved in the state.
      state.user = data.user;
      
      // User's session.
      state.session = data.session;
      
      // User now is logged in.
      state.loggedIn = true;
    });
  
  // Loging process started.
  state.logging = true;
}

// Login the user.
login('root', 'a123z');
```
** Semicolons ";" are not actually needed, but syntax highlighting doesn't know about that ¬¬*

The code above is [Imperative](https://en.wikipedia.org/wiki/Imperative_programming), and that's because is full of side effects and procedural code.

**Common problems:**

- The state, is modified through the time, so it's less unpredictable how the state is going to be at the end of the program execution.

- Makes unit testing difficult, there's a lot of things happening in one function.

- Changes the value of variables like `state` which are out of its context or scope.

## Side effects belongs to the middlewares

The middleware must be the only place where you can execute side effect and other actions, before or after an action ends its life cycle.
```
-> dispatch(action => ({type: LOGIN})) 
  -> middlewareA(store => next => action => next(action))
  -> middlewareB(store => next => action => next(action))
  -> middlewareC(store => next => action => next(action))
  -> reducer((state, action) => state)
```

Here's an example dispatching actions after and before:
```js
import {createAction} from 'redux-actions';

const LOGIN = 'redux-boot/user/LOGIN'
const loginAction = createAction(LOGIN, ({name, pass}) => ({name, pass}))

const LOGIN_AFTER = 'redux-boot/user/LOGIN_AFTER'
const afterLoginAction = createAction(LOGIN_AFTER, ({name, pass}) => ({name, pass}))

const LOGIN_BEFORE = 'redux-boot/user/LOGIN_BEFORE'
const beforeLoginAction = createAction(LOGIN_BEFORE)

const mymodule = {
  reducer: {
    [LOGIN_BEFORE]: (state, action) => {
      return {
        ...state,
        logging: true
    },
    [LOGIN_AFTER]: (state, action) => {
      return {
        ...state,
        logging: false,
        loggedIn: state.user.hasOwnProperty('id')
    }
  },
  middleware: {
    // Reacting to LOGIN action dispatching before/after side effects.
    [LOGIN]: ({dispatch}) => next => action => {
      const {name, pass} = action.payload
      
      // LOGIN_BEFORE action.
      dispatch(beforeLoginAction({name, pass}))
      
      // Execute the LOGIN action.
      const nextResult = next(action)
      
      // Dispatch LOGIN_AFTER action.
      dispatch(afterLoginAction())
      
      // Return the original action.
      return nextResult
    }
  }
}
```

The difference between using the `next()` and `dispatch()` functions:

- `next()`: Dispatch an action using the same cycle of the original action *(not recommended)*.
- `dispatch()`: Dispatch an action with a new life cycle.

## Async side effects

Side effects like the example above, are synchronous, so if any module needs to fetch some Api before the `LOGIN` action is done the `LOGIN_BEFORE` must wait till any **asynchronous** side effect is done too.
Using the `async`/`await` keywords the module above could support async side effects.

Let's make `beforeLoginAction()` function **async compatible**:

```js
import {createAction} from 'redux-actions';

const LOGIN_BEFORE = 'redux-boot/user/LOGIN_BEFORE';
// Notice the "async" keyword which makes this action async compatible.
const beforeLoginAction = createAction(LOGIN_BEFORE, async ({name, pass}) => ({name, pass}));

const LOGIN = 'redux-boot/user/LOGIN';
const loginAction = createAction(LOGIN, ({name, pass}) => ({name, pass}));

const LOGIN_AFTER = 'redux-boot/user/LOGIN_AFTER';
const afterLoginAction = createAction(LOGIN_AFTER);

const mymodule = {
  reducer: {
    [LOGIN_BEFORE]: {
      // Mutate the state in case of success.
      next: (state, action) => {
        return {
          ...state,
          logging: true
        }
      },
      // Mutate the state in case of failure.
      throw: (state, action) => {
        return {
          ...state,
          logging: false,
          loggingError: "Can't login right now."
        }
      }
    },
    [LOGIN_AFTER]: (state, action) => {
      return {
        ...state,
        logging: false,
        loggedIn: state.user.hasOwnProperty('id')
    }
  },
  middleware: {
    // Reacting to LOGIN action dispatching before/after side effects.
    // Notice the "async" keyword so the "await" keyword can be used below.
    [LOGIN]: ({dispatch}) => next => async action => {
      const {name, pass} = action.payload
      
      // LOGIN_BEFORE action.
      // Notice the "await" keyword which makes it async compatible.
      await dispatch(beforeLoginAction({name, pass}))
      
      // Execute the LOGIN action, after LOGIN_BEFORE
      // and it's own async side effects are done.
      const nextResult = next(action)
      
      // Dispatch LOGIN_AFTER action.
      dispatch(afterLoginAction())
      
      // Return the original action.
      return nextResult
    }
  }
}
```

Asynchronous actions / side effects and middlewares are possible because `redux-boot` use the [`redux-promise`](https://github.com/acdlite/redux-promise) Redux's middleware.