import { SET_SESSIONS, REMOVE_SESSIONS, SELECT_SESSIONS, UNSELECT_SESSION, SET_COUNTERS,
  SELECT_COUNTER, UNSELECT_COUNTER, REMOVE_COUNTERS, SELECT_INSTANCE } from './actionTypes'

export const setSessions = (sessions) => {
  return {
    type: SET_SESSIONS,
    sessions: sessions
  }
}
export const removeSessions = () => {
  return {
    type: REMOVE_SESSIONS
  }
}

export const selectSession = (session) => {
  return {
    type: SELECT_SESSIONS,
    session: session
  }
}

export const unselectSession = () => {
  return {
    type: UNSELECT_SESSION
  }
}

export const setCounters = (counters) => {
  return {
    type: SET_COUNTERS,
    counters: counters
  }
}

export const selectCounter = (counter) => {
  return {
    type: SELECT_COUNTER,
    counter: counter
  }
}
export const unselectCounter = () => {
  return {
    type: UNSELECT_COUNTER
  }
}
export const removeCounters = () => {
  return {
    type: REMOVE_COUNTERS
  }
}
export const selectInstance = (instance) => {
  return {
    type: SELECT_INSTANCE,
    instance: instance
  }
}