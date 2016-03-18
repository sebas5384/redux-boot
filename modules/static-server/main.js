import express from 'express'
import {BOOT} from '../../lib/bootstrap'
import {HTTP_BOOT} from '../web-server/main'

const handlers = {
  [BOOT]: (state, action) => {
    return {
      ...state,
      variables: {
        static: []
      }
    }
  }
}

export default {
  reducer: handlers,
  middleware({getState}) {
    return dispatch => action => {

      if (action.type == HTTP_BOOT) {
        let httpServer = action.payload.httpServer
        const folders = getState().variables.static
        folders.forEach(folder => httpServer.use(express.static(folder)))
      }

      return dispatch(action)
    }
  }
}
