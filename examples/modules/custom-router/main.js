import fs from 'fs'
import { HTTP_REQUEST, HTTP_BOOT } from '../../../modules/web-server/main'
import {createAction} from 'redux-actions'

export const HTTP_REQUEST_CHANGE = 'custom-router/routes/file/LOADED'

export const BOOT = 'choko/core/BOOT'


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

      if (action.type == HTTP_REQUEST && action.payload.request.originalUrl == '/routes') {
        const loadAction = loadRoutesFile('modules/custom-router/routes.yml')
        const loaded = await dispatch(loadAction)

        action.payload.response.send(loaded.payload)
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

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, data) => {
      // error && reject(error)
      resolve(data)
    })
  })
}