import { SET_DATE } from '../../actions/actionTypes'

initialState = {
  date: ""
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case SET_DATE:
      return {
        ...state,
        date: action.date
      }
    default: 
      return state
  }
}

export default reducer