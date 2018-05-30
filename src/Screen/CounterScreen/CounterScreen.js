import React, { Component} from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import Counters from '../../Component/Counters/Counters'
import getDomain from '../../lib/domain'
import { setSessions, loading }  from '../../store/actions/index'
import { connect } from 'react-redux'
import Loading from '../../Component/Loading/Loading'
import axios from 'axios'


class CounterScreen extends Component {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  removeSession = () => {
    this.props.showLoading(true)
    date = this.props.date
    user_id = this.props.instance.user.id
    token = this.props.token
    id = this.props.instance.instance.id
    axios.delete(`${getDomain(this.props.domain)}/sessions/${id}?user_id=${user_id}&date=${date}`,{ 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.showLoading(false)
      this.props.setSessions(res.data)
      this.props.navigator.pop({
        animated: true,
        animationType: 'fade'
      });
    }).catch(error => {
      console.log(error)
      this.props.showLoading(false)
    })
  }

  onNavigatorEvent = (event) => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "editSession") {
        this.props.navigator.showModal({
          screen: "abalogger.SessionModalScreen",
          title: "Edit Session",
          animationType: 'slide-up',
          passProps: {edit: true},
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
      else {
        Alert.alert(
          'Delete Session',
          'Are you sure you want to delete this session?',
          [
            {text: 'Cancel', onPress: () => null, style: 'cancel'},
            {text: 'Delete', onPress: () => this.removeSession()},
          ],
          { cancelable: false }
        )
      }
    }
  }


 render() {
    return (
      <View style={styles.superContainer}>
        <Counters/>
        <Loading/> 
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
    token: state.auth.token,
    domain: state.auth.domain,
    date: state.calendar.date,
    instance: state.sessions.instance
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    showLoading: (animate) => dispatch(loading(animate)),
    setSessions: (sessions) => dispatch(setSessions(sessions))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(CounterScreen)