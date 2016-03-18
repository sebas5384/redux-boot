// --------------------------------------------------
// CUSTOM APLICATION CODE.

// Choko Boostrap.
import Choko from '../index'
import path from 'path'

// Modules.
import WebServerModule from '../modules/web-server/main'
import StaticServerModule from '../modules/static-server/main'

const initialState = {
  variables: {
    name: 'My custom APP',
    static: [
      path.join(__dirname, 'public')
    ]
  }
}

// @TODO: Calculate dependency order by its package.json.
const enabledModules = [
  WebServerModule,
  StaticServerModule
]

const chokoApp = Choko(initialState, enabledModules)

// @TODO:
// 1. Immutable-js
// 2. Async
// 3. redux-router
