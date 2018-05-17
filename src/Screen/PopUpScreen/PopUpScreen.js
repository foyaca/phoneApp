import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { removeToken, removeEmail, removePassword, loading } from '../../store/actions/index'
import { removeClients, unselectClient, removeUser, setDomain } from '../../store/actions/index'
import Icon from 'react-native-vector-icons/MaterialIcons'
import App from '../../../App'

let domain = ""

class PopUpScreen extends Component {
  constructor(props) {
    super(props)
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

  domainChangedHandler = (val) => {
    domain = val
  }

  close = () => {
    this.props.navigator.dismissModal({animationType: 'slide-down'})
  }

  save = () => {
    this.props.setDomain(domain)
    AsyncStorage.setItem('@Domain:key', domain, (err) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.clearState()
  }

  render() {
    if (this.props.token !== "") {
      return (
        <View style={styles.container }>
          <View style={styles.domainContainer}>
            <TextInput style={styles.input} placeholder={this.props.domain} underlineColorAndroid="transparent" onChangeText={this.domainChangedHandler} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.close} style={[styles.button, {backgroundColor: "#E87A49"}]}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.save} style={[styles.button, {backgroundColor: "#00BFA5"}]}>
              <Text style={styles.buttonText}>SAVE</Text>
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
    backgroundColor: "#ecf2f9"
  },
  domainContainer: {
    margin: "5%",
    height: "40%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    height: 50,
    borderColor: '#4080bf',
    borderWidth: 1,
    borderRadius: 5
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row"
  },
  button: {
    width: "40%",
    width: "42.5%",
    marginLeft: "5%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4080bf",
    borderRadius: 5,
    flexDirection: "row"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "white"
  }
})

const mapStateToProps = state => {
  return {
    domain: state.auth.domain
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    setDomain: (domain) => dispatch(setDomain(domain)),
    removeEmail: () => dispatch(removeEmail()),
    removePassword: () => dispatch(removePassword()),
    removeToken: () => dispatch(removeToken()),
    removeUser: () => dispatch(removeUser()),
    removeClients: () => dispatch(removeClients()),
    showLoading: (animate) => dispatch(loading(animate)),
    unselectClient: () => dispatch(unselectClient())
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(PopUpScreen)