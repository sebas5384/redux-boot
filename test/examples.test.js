import test from 'tape'

// import boot, {BOOT} from 'redux-boot'
import boot, {BOOT} from '../src/index'
import {createAction} from 'redux-actions'
import axios from 'axios'

test('Example with a simple reducer', assert => {
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
    assert.equal(
      store.getState().foo,
      'baz',
      "State was changed by testModule reducer during the bootstrap"
    )
    assert.end()
  })

})

test('Example with a simple reducer and a sync middleware', assert => {
  const CHANGE_FOO = 'redux-boot/test/CHANGE_FOO'

  const changeFoo = createAction(CHANGE_FOO)

  const initialState = {
    foo: 'bar'
  }

  const testModule = {
    // A simple reducer that changes state on the "CHANGE_FOO" action.
    reducer: {
      [CHANGE_FOO]: (state, action) => {
        return {
          ...state,
          foo: action.payload
        }
      }
    },

    // Dispatch the side-effect action "changeFoo" that reacts to the bootstrap.
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
    assert.equal(
      store.getState().foo,
      'baz',
      "State was changed by testModule reducer with data from middleware"
    )
    assert.end()
  })

})

test('Example with a simple reducer and an async middleware', assert => {
  const CHANGE_FOO = 'redux-boot/test/CHANGE_FOO'

  const changeFoo = createAction(CHANGE_FOO, async (value) => {

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), 1)
    })
  })

  const initialState = {
    foo: 'bar'
  }

  const testModule = {
    // A simple reducer that changes state on the "CHANGE_FOO" action.
    reducer: {
      [CHANGE_FOO]: (state, action) => {
        return {
          ...state,
          foo: action.payload
        }
      }
    },

    // Dispatch the side-effect action "changeFoo" that reacts to the bootstrap.
    middleware: {
      [BOOT]: store => next => async action => {
        const result = next(action)
        await store.dispatch(changeFoo('baz'))
        return result
      }
    }
  }

  const modules = [
    testModule
  ]

  const app = boot(initialState, modules)

  app.then(({action, store}) => {
    assert.equal(
      store.getState().foo,
      'baz',
      "State was changed by testModule reducer with data from async middleware"
    )
    assert.end()
  })

})

test('Example with a simple reducer and an async middleware (Spotify API)', assert => {

  // Declare the initial state of your App.
  const initialState = {
    artist: ''
  }

  const SPOTIFY_SEARCH = 'redux-boot/test/SPOTIFY_SEARCH'

  const spotifySearchAction = createAction(SPOTIFY_SEARCH, async (name, type) => {

    const result = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: name,
        type: type
      }
    })

    return result
  })

  // Declare your module.
  const testModule = {

    // Reducers handlers.
    reducer: {

      // Modify state reacting to a Spotify Search.
      [SPOTIFY_SEARCH]: {
        // The search was a success.
        next(state, action) {
          const firstArtist = action.payload.data.artists.items[0]
          return {
            ...state,
            artist: firstArtist.name
          }
        },
        // The search was a failure.
        throw(state, action) {
          console.error(action.payload.data, action.payload.statusText)
          return state
        }
      }
    },

    // Middleware handlers.
    middleware: {
      [BOOT]: store => next => async action => {

        const nextResult = next(action)

        // Dispatch a side-effect action to alter (create) the state.
        // In this case we are searching for an artist which the name
        // starts with "led".
        await store.dispatch(spotifySearchAction('led', 'artist'))

        return nextResult
      }
    }

  }

  // Declare the modules you want to use.
  const modules = [
    testModule
  ]

  // Create the App.
  const app = boot(initialState, modules)

  // When the App is
  app.then(({action, store}) => {

    assert.equal(
      store.getState().artist,
      'Led Zeppelin',
      'A side-effect of BOOT action modified the state using a middleware and reducer handler.'
    )

  })

  assert.end()
})
