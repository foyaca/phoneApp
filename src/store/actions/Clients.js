import { SET_CLIENTS, SELECT_CLIENT, REMOVE_CLIENTS, UNSELECT_CLIENT } from '../actions/actionTypes'

export const setClients = (clients) => {
  return {
    type: SET_CLIENTS,
    clients: clients
  }
}

export const selectClient = (client) => {
  return {
    type: SELECT_CLIENT,
    client: client
  }
}

export const removeClients = () => {
  return {
    type: REMOVE_CLIENTS
  }
}

export const unselectClient = () => {
  return {
    type: UNSELECT_CLIENT
  }
}