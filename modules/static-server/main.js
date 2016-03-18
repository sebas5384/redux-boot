import express from 'express'

import {ActionTypes as ChokoActionTypes} from '../../index'
import { HTTP_BOOT } from '../web-server/main'

export default {
  middleware({getState}) {
    return dispatch => action => {

      if (action.type == HTTP_BOOT) {

        let httpServer = action.payload.httpServer

        httpServer.use(express.static('public'))
      }

      return dispatch(action)
    }
  }
}