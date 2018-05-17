import { SET_SESSIONS, REMOVE_SESSIONS, SELECT_SESSIONS, UNSELECT_SESSION,
  SET_COUNTERS, SELECT_COUNTER, UNSELECT_COUNTER, REMOVE_COUNTERS, SELECT_INSTANCE } from '../../actions/actionTypes'

const initialState = {
  sessions: [],
  selectSection: {},
  counters: [],
  counter: {},
  instance: {}
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case SET_SESSIONS:
      return {
        ...state,
        sessions: action.sessions
      }
    case REMOVE_SESSIONS:
      return {
        ...state,
        sessions: []
      }
    case SELECT_SESSIONS:
      return {
        ...state,
        selectSection: action.session
      }
    case UNSELECT_SESSION:
      return {
        ...state,
        selectSection: {}
      }
    case SET_COUNTERS:
      return {
        ...state,
        counters: action.counters
      }
    case SELECT_COUNTER:
      return {
        ...state,
        counter: action.counter
      }
    case UNSELECT_COUNTER:
      return {
        ...state,
        counter: {}
      }
    case REMOVE_COUNTERS:
      return {
        ...state,
        counters: []
      }
    case SELECT_INSTANCE:
      return {
        ...state,
        instance: action.instance
      }
    default: 
      return state
  }
}

export default reducer