import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import moment from 'moment';
import configureStore from './src/store/ConfigStore'
const store = configureStore()

import AuthScreen from './src/Screen/Auth/Auth'
import ClientScreen from './src/Screen/ClientScreen/ClientScreen'
import SettingScreen from './src/Screen/SettingScreen/SettingScreen'
import CalendarScreen from './src/Screen/CalendarScreen/CalendarScreen'
import SessionScreen from './src/Screen/SessionScreen/SessionScreen'
import CounterScreen from './src/Screen/CounterScreen/CounterScreen'
import SessionModalScreen from './src/Screen/SessionModalScreen/SessionModalScreen'
import PopUpScreen from './src/Screen/PopUpScreen/PopUpScreen'
import ClientReportScreen from './src/Screen/ClientReportScreen/ClientReportScreen'
import ClientReportModalScreen from './src/Screen/ClientReportModalScreen/ClientReportModalScreen'
import SignatureScreen from './src/Screen/SignatureScreen/SignatureScreen'
import MonthScreen from './src/Screen/MonthScreen/MonthScreen'
import ClientReportSignatureScreen from './src/Screen/ClientReportSignatureScreen/ClientReportSignatureScreen'
// Register Screen
Navigation.registerComponent("abalogger.AuthScreen", () => AuthScreen, store, Provider)
Navigation.registerComponent("abalogger.ClientScreen", () => ClientScreen, store, Provider)
Navigation.registerComponent("abalogger.SettingScreen", () => SettingScreen, store, Provider)
Navigation.registerComponent("abalogger.CalendarScreen", () => CalendarScreen, store, Provider)
Navigation.registerComponent("abalogger.SessionScreen", () => SessionScreen, store, Provider)
Navigation.registerComponent("abalogger.CounterScreen", () => CounterScreen, store, Provider)
Navigation.registerComponent("abalogger.SessionModalScreen", () => SessionModalScreen, store, Provider)
Navigation.registerComponent("abalogger.PopUpScreen", () => PopUpScreen, store, Provider)
Navigation.registerComponent("abalogger.ClientReportScreen", () => ClientReportScreen, store, Provider)
Navigation.registerComponent("abalogger.ClientReportModalScreen", () => ClientReportModalScreen, store, Provider)
Navigation.registerComponent("abalogger.SignatureScreen", () => SignatureScreen, store, Provider)
Navigation.registerComponent("abalogger.MonthScreen", () => MonthScreen, store, Provider)
Navigation.registerComponent("abalogger.ClientReportSignatureScreen", () => ClientReportSignatureScreen, store, Provider)

// start an App

export default () => {
  moment.locale('en');
  Navigation.startSingleScreenApp({
    screen:  { 
      screen: "abalogger.AuthScreen",
      navigatorStyle: {
        navBarHidden: true
      }
    }
  })
}