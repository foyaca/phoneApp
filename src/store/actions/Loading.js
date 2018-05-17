import { LOADING } from './actionTypes'

export const loading = (animation) => {
  return {
    type: LOADING,
    animate: animation
  }
}