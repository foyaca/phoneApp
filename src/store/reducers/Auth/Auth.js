import { SET_TOKEN, SET_EMAIL, SET_PASSWORD, REMOVE_TOKEN, REMOVE_EMAIL, REMOVE_PASSWORD, SET_DOMAIN, REMOVE_DOMAIN} from '../../actions/actionTypes'

const initialState = {
  email: "frank@example.com",
  password: "12345678",
  token: null,
  domain: ""
}
const reducer = (state=initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case REMOVE_TOKEN:
      return {
        ...state,
        token: null
      }
    case SET_EMAIL: 
      return {
        ...state,
        email: action.email
      }
    case REMOVE_EMAIL: 
      return {
        ...state,
        email: ""
      }
    case SET_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    case REMOVE_PASSWORD: 
      return {
        ...state,
        password: ""
      }
    case SET_DOMAIN: 
      return {
        ...state,
        domain: action.domain
      }
    case REMOVE_DOMAIN: 
      return {
        ...state,
        domain: ""
      }
    default: 
      return state
  }
  
}

export default reducer