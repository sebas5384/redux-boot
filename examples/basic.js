// --------------------------------------------------
// CUSTOM APLICATION CODE.

// Choko Boostrap.
import Choko from '../index'
import path from 'path'

// Modules.
import CustomRouter from './modules/custom-router/main'
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
  CustomRouter,
  StaticServerModule
]

const chokoApp = Choko(initialState, enabledModules)

// @TODO:
// 0. Tests - DONE :)
// 1. Immutable-js
// 2. Async - DONE :)
// 3. Dependencies between npm's and custom modules.
// 4. Rules
