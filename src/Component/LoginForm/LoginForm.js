import React, { Component } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ImageBackground, AsyncStorage } from 'react-native'
import path from '../../assets/logo.png'
import { setToken, setEmail, setPassword, setUser } from '../../store/actions/index'
import { loading, message, showMessage, setDomain }  from '../../store/actions/index'
import Loading from '../Loading/Loading'
import ShowMessage from '../ShowMessage/ShowMessage'
import mainTabs from '../../Screen/MainPage/MainPage'
import { connect }from 'react-redux'
import axios from 'axios'
import getDomain from '../../lib/domain'


class LoginForm extends Component {

  componentWillMount() {
    AsyncStorage.getItem('@Domain:key').then (value => {
      if (value !== null){
        this.props.setDomain(value)
      }
    }).catch ((error) => {
      this.props.sendMessage("Please Set a domain")
      this.props.showMessage(true)
    })
  }
  
  domainChangedHandler = (val) => {
    this.props.setDomain(val)
    this.props.showMessage(false)
    AsyncStorage.setItem('@Domain:key', val, (err) => {
      if (err !== null) {
        console.log(err)
        this.props.sendMessage("Something went wrong. Please try again.")
        this.props.showMessage(true)
      }
    })
  }

  emailChangedHandler = (val) => {
    this.props.setEmail(val)
    this.props.showMessage(false)
  }

  passChangedHandler = (val) => {
    this.props.setPassword(val)
    this.props.showMessage(false)
  }
  
  LogIn = () => {
    if (this.props.domain === "") {
      this.props.sendMessage("Please insert a domain")
      this.props.showMessage(true)
      return
    }
    if (this.props.email === "") {
      this.props.sendMessage("Please insert an email")
      this.props.showMessage(true)
      return
    }
    if (this.props.password === "") {
      this.props.sendMessage("Please insert a password")
      this.props.showMessage(true)
      return
    }
    this.props.showLoading(true)
    const email = this.props.email
    const password = this.props.password
    axios.post(`${getDomain(this.props.domain)}/auth`, {
      email,
      password
    })
    .then(data => {
      this.props.showLoading(false)
      this.props.setToken(data.data.auth_token)
      if (this.props.token !== "") {
        const user = { id: data.data.id, name: data.data.name, role: data.data.roles}
        this.props.setUser(user)
        this.props.sendMessage("")
        mainTabs()
      }
      else {
        this.props.sendMessage("Credentials can't be saved. Please try again.")
        this.props.showMessage(true)
      }
    }).catch(error => {
      this.props.showLoading(false)
      if (error.response === undefined) {
        this.props.sendMessage("Server is not working. Please try later")
        this.props.showMessage(true)
      }
      else if (error.response.status === 401) {
        this.props.sendMessage("Invalid email or password. Please try again.")
        this.props.showMessage(true)
      }
      else if (error.response.status === 404) {
        this.props.sendMessage("Something went wrong. Please check domain.")
        this.props.showMessage(true)
      }
      else
        this.props.sendMessage("Something went wrong. Please try again.")
        this.props.showMessage(true)
        console.log(error)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {/* header */}
        </View>
        <View style={styles.formContainer }>
          <ImageBackground source={path} style={styles.backgroundImage}/>
          <View style={styles.form}>
            <TextInput style={[styles.input, {marginTop: "20%"}]} placeholder={"Insert Domain.  Ex: google.com"} underlineColorAndroid="transparent" onChangeText={this.domainChangedHandler} value={this.props.domain} />
            <TextInput style={styles.input} placeholder={"Insert E-mail"} underlineColorAndroid="transparent" onChangeText={this.emailChangedHandler} />
            <TextInput style={styles.input} placeholder={"Insert Password"} secureTextEntry={true} underlineColorAndroid="transparent" onChangeText={this.passChangedHandler}/>
            <TouchableOpacity onPress={this.LogIn} style={styles.button}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loading/>
        <ShowMessage/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  headerContainer: {
    height: "20%",
    backgroundColor: "#4080bf",
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center'
  },
  backgroundImage: {
    width: 130,
    height: 130,
    position: 'absolute',
    top: -74
  },
  form: {
    width: "100%",
    backgroundColor: "#ecf2f9",
    height: "100%",
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 10,
    zIndex: -1
  },
  input: {
    width: "90%",
    height: "12%",
    margin: "3%",
    paddingLeft: 20,
    borderColor: '#4080bf',
    borderWidth: 1,
    borderRadius: 5
  },
  button: {
    width: "90%",
    height: "12%",
    margin: "5%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4080bf",
    borderRadius: 5
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  }
})

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    token: state.auth.token,
    domain: state.auth.domain
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setEmail: (email) => dispatch(setEmail(email)),
    setPassword: (password) => dispatch(setPassword(password)),
    setToken: (token) => dispatch(setToken(token)),
    setDomain: (domain) => dispatch(setDomain(domain)),
    setUser: (user) => dispatch(setUser(user)),
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (show) => dispatch(showMessage(show)),
    sendMessage: (text) => dispatch(message(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)