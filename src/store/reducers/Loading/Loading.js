import { LO, LOADING }
 from '../../actions/actionTypes'

const initialstate = {
  animate: false
}
const reducer = (state=initialstate, action) => {
  switch(action.type){
    case LOADING:
      return {
        ...state,
        animate: action.animate
      }
    default:
      return state
  }

}

export default reducer