import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from './src/store/ConfigStore'

const store = configureStore()

const Redux = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

AppRegistry.registerComponent('ABAlogger', () => Redux);
