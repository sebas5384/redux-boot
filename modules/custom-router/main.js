import fs from 'fs'
import { HTTP_REQUEST, HTTP_BOOT } from '../web-server/main'
import {ActionTypes as ChokoActionTypes} from '../../index'

export const HTTP_REQUEST_CHANGE = 'custom-router/routes/file/LOADED'

export const BOOT = 'choko/core/BOOT'

export default {
  reducer(state, action) {

    switch (action.type) {
      case ChokoActionTypes.BOOT:
        console.log('custom-router');
        return state
      default:
        return state
    }
  },
  middleware({getState}) {
    return dispatch => async (action) => {
      if (action.type == HTTP_REQUEST && action.payload.request.originalUrl == '/routes') {
        return dispatch(await loadRoutesFile('modules/custom-router/routes.yml'))
      }
      else {
        return dispatch(action)
      }
    }
  }
}


// export const loadRoutesFile = createAction(HTTP_REQUEST_CHANGE, async (path) => {
//   const fileContent = await readFileAsync(path)
//   return {
//     type: HTTP_REQUEST_CHANGE,
//     payload: {
//       content: fileContent
//     }
//   }
// })

export async function loadRoutesFile(path) {
  const fileContent = await readFileAsync(path)
  return {
    type: HTTP_REQUEST_CHANGE,
    payload: {
      content: fileContent
    }
  }
}


function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, data) => {
      // error && reject(error)
      resolve(data)
    })
  })
}