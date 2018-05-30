import React, { Component} from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { showMessage } from '../../store/actions/index'
import Loading from '../../Component/Loading/Loading'
import Report from '../../Component/Report/Report'
import App from '../../../App'


class ClientReportScreen extends Component {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }
  
  onNavigatorEvent = (event) => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        this.props.showMessage(false)
      }
    }
  }

  getReport = (client, date, user) => {
    this.props.navigator.showModal({
      screen: "abalogger.ClientReportModalScreen",
      title: "Client Hours Report",
      animationType: 'slide-up',
      passProps: {clientSelected: client, date: date, userSelected: user},
      navigatorStyle: {
        navBarBackgroundColor: '#4080bf',
        navBarButtonColor: 'white',
        navBarTextColor: 'white'
      },
      navigatorButtons: {
        leftButtons: [
          {}
        ]
      }
    })
  }

  getMonth = () => {
    this.props.navigator.showModal({
      screen: "abalogger.MonthScreen",
      title: "Select Month",
      animationType: 'slide-up',
      navigatorStyle: {
        navBarBackgroundColor: '#4080bf',
        navBarButtonColor: 'white',
        navBarTextColor: 'white'
      },
      navigatorButtons: {
        leftButtons: [
          {}
        ]
      }
    })
  }

 render() {
  if (this.props.token !== "")
    return (
      <View style={styles.superContainer}>
        <Report getReport={this.getReport} getMonth={this.getMonth} />
        <Loading/> 
      </View>
    )
  else
    App()
  }
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}
const mapDispacthToProps = (dispatch) => {
  return {
    showMessage: (action) => dispatch(showMessage(action))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(ClientReportScreen)