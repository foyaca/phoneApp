import { MESSAGE, SHOW_MESSAGE} from '../../actions/actionTypes'

const initialState = {
  message: "",
  show: false
}
 const reducer = (state=initialState, action) => {
  switch (action.type) {
    case MESSAGE: 
      return {
        ...state,
        message: action.message
      }
    case SHOW_MESSAGE:
      return {
        ...state,
        show: action.show
      }
    default:
      return state
  }
 }

export default reducer