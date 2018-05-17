import { SET_USER, REMOVE_USER } from '../../actions/actionTypes'

const initialState = {
  user: {}
}

const reducer = (state=initialState, action) => {
  switch(action.type) {

    case SET_USER:
      return {
        ...state,
        user: action.user
      }
    case REMOVE_USER:
      return {
        ...state,
        user: {}
      }
    default: 
      return state
  }

}

export default reducer