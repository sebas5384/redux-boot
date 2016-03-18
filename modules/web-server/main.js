import express from 'express'
import {handleActions} from 'redux-actions'
import {BOOT} from '../../lib/bootstrap'

export const HTTP_REQUEST = 'choko/core/web-server/HTTP_REQUEST'
export const HTTP_BOOT = 'choko/core/web-server/HTTP_BOOT'

const reducers = {
  [BOOT]: (state, action) => {
    return {
      ...state,
      response: 'FUM'
    }
  }
}

export default {
  reducer: reducers,

  middleware({getState}) {
    return dispatch => action => {
      if (action.type == BOOT) {

        // Create webserver.
        let httpServer = express()

        // Dispatch Http server Boot action.
        dispatch(httpBoot({httpServer}))

        httpServer.use((request, response, next) => {
          // Dispatch Http Request Action.
          dispatch(httpRequest({request, response}))

          console.log('\n===> FINAL STATE\n', getState().response)

          response.send(getState().response)

          next()
        })

        httpServer.listen(3000)

        return dispatch(action)
      }
    }
  }
}

export function httpRequest({request, response}) {
  return {
    type: HTTP_REQUEST,
    payload: {
      request,
      response
    }
  }
}

export function httpBoot({httpServer}) {
  return {
    type: HTTP_BOOT,
    payload: {
      httpServer
    }
  }
}
