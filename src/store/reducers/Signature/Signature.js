import { SET_SIGNATURE, REMOVE_SIGNATURE, SET_CLIENT_SIGNATURE } from '../../actions/actionTypes'

initialstate = {
  signature: null
}
const reducer = (state=initialstate, action) => {
  switch (action.type) {
    case SET_SIGNATURE: 
      return {
        ...state,
        signature: action.signature
      }
    case SET_CLIENT_SIGNATURE: 
      return {
        ...state,
        clientSignature: action.clientSignature
      }
    case REMOVE_SIGNATURE: 
      return {
        ...state,
        signature: null
      }
    
    default:
      return state
  }
}

export default reducer