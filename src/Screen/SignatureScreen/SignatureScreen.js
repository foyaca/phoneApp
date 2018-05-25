import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { setSignature } from '../../store/actions/index'
import { connect } from 'react-redux'
import SignatureCapture from 'react-native-signature-capture'
import { loading, message, showMessage }  from '../../store/actions/index'
import Icon from 'react-native-vector-icons/MaterialIcons'
import getDomain from '../../lib/domain'
import moment from 'moment'
import axios from 'axios'
import Loading from '../../Component/Loading/Loading'
import ShowMessage from '../../Component/ShowMessage/ShowMessage'

class SignatureScreen extends Component {
  state = {
    dirty: false
  }

  constructor(props) {
    super(props)
  }

  saveSign = () => {
    this.refs["sign"].saveImage()
  }

  resetSign = () => {
    this.refs["sign"].resetImage()
    this.setState({dirty: false})
  }

  handleDrag = () => this.setState({dirty: true})

  onSaveEvent = (result) => {
    if (this.state.dirty) {
      token = this.props.token
      client_id = this.props.clientSelected[0].id
      user_id = this.props.userSelected[0].id
      date = moment(this.props.date).format("YYYY-MM-DD")
      this.props.showLoading(true)
      if (this.props.signature === null) {
        if (this.props.forWho === "Client")
          params = {signature: { client_id: client_id, user_id: user_id, date: date, client_signature: result.encodedn, session_id: this.props.session_id }}
        else
          params = {signature: { client_id: client_id, user_id: user_id, date: date, user_signature: result.encoded, session_id: this.props.session_id }}
        axios.post(`${getDomain(this.props.domain)}/signatures`,
          params, {
          headers: {Authorization: `${token}`}
        }).then(res =>{ 
          this.props.showLoading(false)
          this.props.setSignature(res.data)
          this.props.navigator.dismissModal({animationType: 'slide-down'})
        }).catch(error => {
          console.log(error)
          this.props.sendMessage("Something went wrong create. Please try again.")
          this.props.showMessage(true)
          this.props.showLoading(false)
        })
      }
      else {
        if (this.props.forWho === "Client")
          params = {signature: {client_signature: result.encoded }}
        else
          params = {signature: {user_signature: result.encoded }}
        axios.patch(`${getDomain(this.props.domain)}/signatures/${this.props.signature.id}`, 
          params, { 
          headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.showLoading(false)
          this.props.setSignature(res.data)
          this.props.navigator.dismissModal({animationType: 'slide-down'})
        }).catch(error => {
          console.log(error)
          this.props.sendMessage("Something went wrong updtae. Please try again.")
          this.props.showMessage(true)
          this.props.showLoading(false)
        })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SignatureCapture
          style={styles.signature}
          ref="sign"
          onSaveEvent={this.onSaveEvent}
          onDragEvent={this.handleDrag}
          saveImageFileInExtStorage={false}
          showBorder={false}
          showTitleLabel={false}
          showNativeButtons={false}
          viewMode="portrait"
          maxSize={500}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: "#FF9800",}]} onPress={() => { this.saveSign() } } >
              <Text style={{color: "white", fontSize: 20}}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: "#00BFA5",}]} onPress={() => { this.resetSign() } } >
              <Text style={{color: "white", fontSize: 20}}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: "#4080bf",}]} onPress={() => this.props.navigator.dismissModal({animationType: 'slide-down'}) } >
              <Text style={{color: "white", fontSize: 20}}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="warning" size={60} color="#FF9800"/>
          <Text style={styles.warning}>*** By Signing, I certify that I have read and agree with the information in the previous screen ***</Text>
          <Text style={styles.date}>{moment(this.props.date).format("MMM, DD YYYY")} </Text>
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
    backgroundColor: "#F5F5F5",
  },
  signature: {
    height: "30%",
    width: "90%",
    margin: "5%"
  },
  buttonContainer: {
    flexDirection: "row",
    height: "10%",
    width: "90%",
    margin: "5%",
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "30%",
    marginLeft: "3%",
    borderRadius: 5
  },
  infoContainer: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
  warning: {
    width: "80%",
    fontSize: 18,
    color: "#FF9800",
    fontStyle: 'italic',
    alignItems: "center"
  },
  date: {
    fontSize: 16,
    fontStyle: 'italic',
    color: "#FF9800"
  },
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    signature: state.signature.signature
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSignature: (signature) => dispatch(setSignature(signature)),
    setClientSignature: (signature) => dispatch(setClientSignature(signature)),
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (show) => dispatch(showMessage(show)),
    sendMessage: (text) => dispatch(message(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignatureScreen)