import React, { Component } from 'react'
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { removeToken, removeEmail, removePassword, loading} from '../../store/actions/index'
import { removeClients, unselectClient, removeUser } from '../../store/actions/index'
import Icon from 'react-native-vector-icons/MaterialIcons'
import App from '../../../App'

class SettingScreen extends Component {
  constructor(props) {
    super(props)
  }

  signOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Log Out', onPress: () => this.clearState()},
      ],
      { cancelable: false }
    )
  }
  
  clearState = () => {
    this.props.removeEmail()
    this.props.removePassword()
    this.props.removeToken()
    this.props.removeUser()
    this.props.removeClients()
    this.props.unselectClient()
    this.props.showLoading(false)
    App()
  }

  showPopUp = () => {
    this.props.navigator.showModal({
      screen: 'abalogger.PopUpScreen',
      title: "Change Domain",
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
    if (this.props.token !== "") {
      return (
        <View style={styles.container }>
          <View style={styles.userContainer}>
            <Icon name="person" size={35} style={styles.userIcon} color="#4080bf"/>
            <Text style={styles.userText}>{this.props.user.name}</Text>
          </View>
         <View style={styles.domainContainer}>
            <View style={styles.domain}>
              <Text style={styles.domainText}>{this.props.domain}</Text>
            </View>
            <TouchableOpacity onPress={this.showPopUp} style={styles.buttonDomain}>
             <Icon name="border-color" size={25} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.signOut} style={styles.button}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else
      return App()
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  userContainer: {
    flexDirection: "row",
    backgroundColor: "#ecf2f9",
    margin: "5%",
    height: 50,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#4080bf",
    borderWidth: 0.2,
    borderRadius: 5,
    overflow: 'hidden'
  },
  domainContainer: {
    flexDirection: "row",
    margin: "5%",
    height: 50,
    width: "90%",
    borderColor: "#4080bf",
    borderWidth: 0.2,
    borderRadius: 5,
    overflow: 'hidden'
  },
  userIcon: {
   position: "absolute",
   left: 10,
   width: "10%"
  },
  userText: {
    color: "#00264d",
    fontSize: 20,
    position: "absolute",
    left: 45,
    width: "80%",
    padding: 20
  },
  domainText: {
    color: "#00264d",
    fontSize: 20,
    paddingLeft: 15
  },
  buttonContainer: {
    width: "90%",
    margin: "5%"
  },
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4080bf",
    borderRadius: 5,
    flexDirection: "row"
  },
  domain: {
    width: "85%",
    height: 49,
    backgroundColor: "#ecf2f9",
    justifyContent: "center"
  },
  buttonDomain: {
    width: "15%",
    height: 59,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4080bf"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    user: state.user.user
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    removeEmail: () => dispatch(removeEmail()),
    removePassword: () => dispatch(removePassword()),
    removeToken: () => dispatch(removeToken()),
    removeUser: () => dispatch(removeUser()),
    removeClients: () => dispatch(removeClients()),
    showLoading: (animate) => dispatch(loading(animate)),
    unselectClient: () => dispatch(unselectClient())
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(SettingScreen)