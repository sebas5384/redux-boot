import {ActionTypes as ChokoActionTypes} from '../../index'
import { HTTP_REQUEST } from '../web-server/main'

export default {
  reducer(state, action) {

    switch (action.type) {
      case ChokoActionTypes.BOOT:
        console.log('react-router');
        return state
      
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