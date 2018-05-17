import { SET_CLIENTS, SELECT_CLIENT, REMOVE_CLIENTS, UNSELECT_CLIENT } from '../../actions/actionTypes'

const initialState = {
  clients: [],
  selectedClient: {}
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case SET_CLIENTS:
      return {
        ...state,
        clients: action.clients
      }
    case SELECT_CLIENT:
      return {
        ...state,
        selectedClient: action.client
      }
    case REMOVE_CLIENTS: 
      return {
        ...state,
        clients: []
      }
    case UNSELECT_CLIENT: 
      return {
        ...state,
        selectedClient: {}
      }
    default:
      return state
  }
}

export default reducer