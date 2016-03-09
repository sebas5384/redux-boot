import { HTTP_REQUEST, HTTP_BOOT } from '../web-server/main'

export default {
  reducer(state, action) {

    switch (action.type) {
      
      case HTTP_REQUEST:
        const request = action.payload.request
        return {
          ...state,
          response: 'Uhuuu!!!! this is the custom router!! ' + request.originalUrl
        }
      default:
        return state
    }
  },
  middleware({getState}) {
    return dispatch => action => {

      if (action.type == HTTP_BOOT) {

        action.payload.httpServer.use((request, response, next) => {
          next()
        })

      }

      return dispatch(action)
    }
  }
}