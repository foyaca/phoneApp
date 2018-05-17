import { SET_DATE } from '../actions/actionTypes'

export const setDate = (date) => {
  return {
    type: SET_DATE,
    date: date
  }
}