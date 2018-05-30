import {SET_REPORT_CLIENTS, REMOVE_REPORT_CLIENTS, SET_REPORT_DATE, SET_REPORT_USERS, REMOVE_REPORT_USERS, SET_REPORT_SESSIONS  } from '../../actions/actionTypes'

initialState = {
  reportDate: "",
  reportClients: [],
  reportUsers: [],
  reportSessions: []
}

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case SET_REPORT_CLIENTS:
      return {
        ...state,
        reportClients: action.clients
      }
    case REMOVE_REPORT_CLIENTS:
      return {
        ...state,
        reportClients: []
      }
    case SET_REPORT_USERS:
      return {
        ...state,
        reportUsers: action.users
      }
    case REMOVE_REPORT_USERS:
      return {
        ...state,
        reportUsers: []
      }
    case SET_REPORT_DATE:
      return {
        ...state,
        reportDate: action.date
      }
    case SET_REPORT_SESSIONS:
      return {
        ...state,
        reportSessions: action.sessions
      }
    default:
      return state
  }
}

export default reducer