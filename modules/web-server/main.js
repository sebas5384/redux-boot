import express from 'express'
import {ActionTypes as ChokoActionTypes} from '../../index'

export const HTTP_REQUEST = 'choko/core/web-server/HTTP_REQUEST'
export const HTTP_BOOT = 'choko/core/web-server/HTTP_BOOT'

export default {
  reducer(state, action) {

    switch (action.type) {

      case ChokoActionTypes.BOOT:
        return {
          ...state,
          testando: 'HEYY PEPE :)'
        }

      case HTTP_REQUEST:
        return {
          ...state,
          response: 'HELLO WORLD!!'
        }
      default:
        return state
    }
  },
  middleware({getState}) {
    return dispatch => action => {

      if (action.type == ChokoActionTypes.BOOT) {
        let returnValue;

        // 
        // WEB SERVER.
        //

        let httpServer = express()

        // Dispatch Http server Boot action.
        dispatch(httpBoot({httpServer}))

        httpServer.use((request, response, next) => {
          
          // Dispatch Http Request Action.
          returnValue = dispatch(httpRequest({request, response}))

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