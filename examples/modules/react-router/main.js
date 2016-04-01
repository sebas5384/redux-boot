import fs from 'fs'
import serialize from 'serialize-javascript'
import {createAction} from 'redux-actions'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'redux-router'

import { HTTP_REQUEST, HTTP_BOOT } from '../../../modules/web-server/main'
export const HTTP_REQUEST_CHANGE = 'custom-router/routes/file/LOADED'

const handlers = {
  [HTTP_REQUEST_CHANGE]: (state, action) => {
    return {
      ...state,
      response: action.payload
    }
  }
}

export default {
  reducer: handlers,
  middleware({getState, dispatch}) {
    return next => async (action) => {
      if (action.type == HTTP_REQUEST) {



        action.payload.response.send(responsePayload)
      }

      return next(action)
    }
  }
}

export const loadRoutesFile = createAction(HTTP_REQUEST_CHANGE, async (path) => {
  const fileContent = await readFileAsync(path)
  return {
    content: fileContent
  }
})