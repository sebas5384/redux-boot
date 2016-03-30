import express from 'express'
import {BOOT} from '../../lib/bootstrap'

export const HTTP_REQUEST = 'choko/core/web-server/HTTP_REQUEST'
export const HTTP_BOOT = 'choko/core/web-server/HTTP_BOOT'

export default {
  middleware({getState, dispatch}) {
    return next => action => {
      if (action.type == BOOT) {

        // Create webserver.
        let httpServer = express()

        // Dispatch Http server Boot action.
        dispatch(httpBoot({httpServer}))

        httpServer.use((request, response, nextHttp) => {

          // Dispatch Http Request Action.
          dispatch(httpRequest({request, response})).then(() => {
            nextHttp()
          })
        })

        httpServer.listen(3000)
      }

      return next(action)
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
