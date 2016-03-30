import express from 'express'
import {BOOT} from '../../lib/bootstrap'
import {HTTP_BOOT} from '../web-server/main'

export default {
  middleware({getState}) {
    return next => action => {

      if (action.type == HTTP_BOOT) {
        let httpServer = action.payload.httpServer
        const folders = getState().variables.static
        folders.forEach(folder => httpServer.use(express.static(folder)))
      }

      return next(action)
    }
  }
}
