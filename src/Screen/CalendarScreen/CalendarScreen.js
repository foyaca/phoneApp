import React, { Component} from 'react'
import { View, StyleSheet, Alert} from 'react-native'
import ShowCalendar from '../../Component/ShowCalendar/ShowCalendar'
import { connect } from 'react-redux'
import { setDate, removeClients, unselectClient, showMessage, loading } from '../../store/actions/index'
import Loading from '../../Component/Loading/Loading'
import Icon from 'react-native-vector-icons/MaterialIcons'
import App from '../../../App'
import moment from 'moment'

class CalendarScreen extends Component {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }
  
  onNavigatorEvent = (event) => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
          this.props.removeClients()
          this.props.unselectClient()
          this.props.showMessage(false)
      }
    }
  }

  getClients = (date) => {
    if (this.props.user.role[0] === "RBT" && moment().isBefore(date)) {
      Alert.alert(
        'Error',
        'You can only schedule up to today\'s date',
        [
          {text: 'OK', onPress: () => null, style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    this.props.showLoading(true)
    this.props.setDate(date)
    this.props.navigator.push({
      screen: "abalogger.ClientScreen",
      title: "Client List",
      passProps: { date: date },
      backButtonTitle: "",
      navigatorStyle: {
        navBarBackgroundColor: '#4080bf',
        navBarButtonColor: 'white',
        navBarTextColor: 'white'
      },
      animated: true, 
      animationType: 'fade'
    })
  }

 render() {
  if (this.props.token !== "")
    return (
      <View style={styles.superContainer}>
        <ShowCalendar getClients={this.getClients}/>
        <Loading/> 
      </View>
    )
  else
    return App()
  }
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    user: state.user.user
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    setDate: (date) => dispatch(setDate(date)),
    showLoading: (action) => dispatch(loading(action)),
    removeClients: () => dispatch(removeClients()),
    unselectClient: () => dispatch(unselectClient()),
    showMessage: (action) => dispatch(showMessage(action))
  }
}


export default connect(mapStateToProps, mapDispacthToProps)(CalendarScreen)