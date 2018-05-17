import { MESSAGE, SHOW_MESSAGE} from '../actions/actionTypes'

export const message = (message) => {
  return {
    type: MESSAGE,
    message: message
  }
}

export const showMessage = (show) => {
  return {
    type: SHOW_MESSAGE,
    show: show
  }
}

