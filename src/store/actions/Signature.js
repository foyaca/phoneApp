import { SET_SIGNATURE, REMOVE_SIGNATURE, SET_CLIENT_SIGNATURE } from '../actions/actionTypes'

export const setSignature = (signature) => {
  return {
    type: SET_SIGNATURE,
    signature: signature
  }
}

export const setClientSignature = (clientSignature) => {
  return {
    type: SET_CLIENT_SIGNATURE,
    clientSignature: clientSignature
  }
}

export const removeSignature = () => {
  return {
    type: REMOVE_SIGNATURE
  }
}