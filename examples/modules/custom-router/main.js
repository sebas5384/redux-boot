import fs from 'fs'
import path from 'path'

import {createAction} from 'redux-actions'
import {HTTP_REQUEST, HTTP_BOOT} from '../../../modules/web-server/main'
import {BOOT} from '../../../lib/bootstrap'

export const CUSTOM_ROUTER_LOAD_FILE = 'custom-router/load-file'

const handlers = {
  [BOOT]: (state, action) => {
    return {
      ...state,
      testando: 'HEYY PEPE :)'
    }
  },

  [HTTP_REQUEST]: (state, action) => {
    const request = action.payload.request
    return {
      ...state,
      response: 'Uhuuu!!!! this is the custom router!! ' + request.originalUrl
    }
  },

  [CUSTOM_ROUTER_LOAD_FILE]: (state, action) => {
    console.log(action, 'VEIO')
    return {
      ...state,
      response: action.payload.content
    }
  }
}

export default {
  reducer: handlers,
  middleware({getState}) {
    return dispatch => (action) => {
      if (action.type == HTTP_REQUEST && action.payload.request.originalUrl == '/routes') {
        return Promise.all(dispatch(loadRoutesFile(path.join(__dirname, '/routes.yml'))))
      }
      else {
        return dispatch(action)
      }
    }
  }
}

export const loadRoutesFile = createAction(CUSTOM_ROUTER_LOAD_FILE, async (path) => {
  const fileContent = await readFileAsync(path)
  console.log(fileContent, 'veio depois :(')
  return {
    content: fileContent
  }
})

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
}
