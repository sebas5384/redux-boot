import { HTTP_REQUEST } from '../web-server/main'

export default {
  reducer(state, action) {

    switch (action.type) {
      case HTTP_REQUEST:

        return {
          ...state,
          response: 'HELL YEAH!!! uhuu!'
        }
      default:
        return state
    }
  }
}