import { createStore, combineReducers } from 'redux'
import Auth from './reducers/Auth/Auth'
import Loading from './reducers/Loading/Loading'
import ShowMessage from './reducers/ShowMessage/ShowMessage'
import Clients from './reducers/Clients/Clients'
import User from './reducers/User/User'
import Calendar from './reducers/Calendar/Calendar'
import Sessions from './reducers/Sessions/Sessions'
import Signature from './reducers/Signature/Signature'
import Report from './reducers/Report/Report'

const rootReducer  = combineReducers({
  auth: Auth,
  user: User,
  loading: Loading,
  message: ShowMessage,
  clients: Clients,
  calendar: Calendar,
  sessions: Sessions,
  signature: Signature,
  report: Report
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore