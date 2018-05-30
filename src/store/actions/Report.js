import {SET_REPORT_CLIENTS, REMOVE_REPORT_CLIENTS, SET_REPORT_DATE, SET_REPORT_USERS, REMOVE_REPORT_USERS, SET_REPORT_SESSIONS } from './actionTypes'

export const setReportClients = (clients) => {
  return {
    type: SET_REPORT_CLIENTS,
    clients: clients
  }
}

export const removeReportClients = () => {
  return {
    type: REMOVE_REPORT_CLIENTS
  }
}

export const setReportUsers = (users) => {
  return {
    type: SET_REPORT_USERS,
    users: users
  }
}

export const removeReportUsers = () => {
  return {
    type: REMOVE_REPORT_USERS
  }
}

export const setReportSessions = (sessions) => {
  return {
    type: SET_REPORT_SESSIONS,
    sessions: sessions
  }
}

export const setReportDate = (date) => {
  return {
    type: SET_REPORT_DATE,
    date: date
  }
}