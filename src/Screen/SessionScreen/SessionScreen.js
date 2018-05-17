import React, { Component} from 'react'
import { View, StyleSheet } from 'react-native'
import Session from '../../Component/Session/Session'
import { selectSession, unselectCounter, removeCounters, unselectSession, showMessage, selectInstance, loading } from '../../store/actions/index'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

class SessionScreen extends Component {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  onNavigatorEvent = (event) => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
          this.props.unselectCounter()
          this.props.removeCounters()
          this.props.unselectSession()
          this.props.showMessage(false)
      }
    }
  }

  getSession = (sessions, id) => {
    for (session of this.props.sessions) {
      for (instance of session.session_instances) {
        if (instance.id === id)
         return session
      }
    }
  }

  onSessionPressed = (sessionInstance) => {
    this.props.showLoading(true)
    session = this.getSession(this.props.sessions, sessionInstance.instance.id)
    this.props.selectInstance(sessionInstance)
    this.props.selectSession(session)
    Promise.all([
      Icon.getImageSource("edit", 30, '#00BFA5'),
      Icon.getImageSource("delete-forever", 30, '#E87A49')
    ]).then( source => {
      this.props.navigator.push({
        screen: "abalogger.CounterScreen",
        title: "Counters",
        backButtonTitle: "",
        navigatorStyle: {
          navBarBackgroundColor: '#4080bf',
          navBarButtonColor: 'white',
          navBarTextColor: 'white'
        },
        navigatorButtons: {
          rightButtons: [{
            icon: source[0],
            id: "editSession"
          },{
            icon: source[1],
            id: "removeSession"
          }]
        },
        animated: true, 
        animationType: 'fade'
      })
    })
  }

  createSession = () => {
    this.props.navigator.showModal({
      screen: "abalogger.SessionModalScreen",
      title: "Create Session",
      animationType: 'slide-up',
      navigatorStyle: {
        navBarBackgroundColor: '#4080bf',
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
    return (
      <View style={styles.superContainer}>
        <Session onSessionPressed={this.onSessionPressed} createSession={this.createSession}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1
  }
})

const mapStateToProps = state => {
  return {
    sessions: state.sessions.sessions
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    selectSession: (session) => dispatch(selectSession(session)),
    selectInstance: (instance) => dispatch(selectInstance(instance)),
    unselectCounter: () => dispatch(unselectCounter()),
    removeCounters: () => dispatch(removeCounters()),
    unselectSession: () => dispatch(unselectSession()),
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (action) => dispatch(showMessage(action))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(SessionScreen)