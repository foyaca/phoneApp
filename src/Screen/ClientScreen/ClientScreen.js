import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { selectClient, removeSessions, showMessage, loading } from '../../store/actions/index'
import Loading from '../../Component/Loading/Loading'
import ClientsList from '../../Component/ClientsList/ClientsList'
import App from '../../../App'

class ClientScreen extends Component {

  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  onNavigatorEvent = (event) => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
          this.props.removeSessions()
          this.props.showMessage(false)
      }
    }
  }

  onClientPressed = (id) => {
    this.props.showLoading(true)
    client = this.props.clients.filter(client => {
      return client.id === id
    })[0]
    this.props.selectClient(client)
    this.props.navigator.push({
      screen: "abalogger.SessionScreen",
      title: client.name,
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
          <ClientsList onClientPressed={this.onClientPressed}/>
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
    clients: state.clients.clients
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    selectClient: (client) => dispatch(selectClient(client)),
    showLoading: (animate) => dispatch(loading(animate)),
    removeSessions: () => dispatch(removeSessions()),
    showMessage: (action) => dispatch(showMessage(action))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(ClientScreen)
