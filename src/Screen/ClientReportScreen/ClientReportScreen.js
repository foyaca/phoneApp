import React, { Component} from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Loading from '../../Component/Loading/Loading'
import Report from '../../Component/Report/Report'
import App from '../../../App'


class ClientReportScreen extends Component {
  constructor(props) {
    super(props)
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

 render() {
  if (this.props.token !== "")
    return (
      <View style={styles.superContainer}>
        <Report getReport={this.getReport}/>
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

export default connect(mapStateToProps)(ClientReportScreen)