import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert} from 'react-native'
import { Table, TableWrapper, Row } from 'react-native-table-component'
import {connect} from 'react-redux'
import { setSignature, removeSignature } from '../../store/actions/index'
import { loading, message, showMessage, setReportSessions }  from '../../store/actions/index'
import moment from 'moment'
import getDomain from '../../lib/domain'
import axios from 'axios'
import Loading from '../../Component/Loading/Loading'
import ShowMessage from '../../Component/ShowMessage/ShowMessage'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ClientReportModalScreen extends Component {
  state = {
    sessionInstance: [],
    tableHead: ["Session Date", "Service", "POS", "Time", "Hours"]
  }

  componentWillMount() {
    this.props.setSignature(this.props.session.signature)
    total = 0
    array = []
    for (instance of this.props.session.session_instances) {
      if (this.props.user.role[0] !== "RBT")
        service = instance.caregiver_training ? "CT" : "BAS"
      else
        service = "N/A"
      start = moment(instance.start_time).utc()
      end = moment(instance.end_time).utc()
      time = `${start.format("h:mm A")} ${end.format("h:mm A")}`
      diff = end.diff(start)/3600000
      total += parseFloat(diff)
      array.push([ moment(this.props.session.session_date).format("ddd MMM, DD YYYY"), service, instance.place_of_service, time, diff])
    }
    array.push(["Total", "", "", "", total])
    this.setState({sessionInstance: array})
  }

  removeSignature = (params, token) => {
    this.props.showLoading(true)
    axios.patch(`${getDomain(this.props.domain)}/signatures/${this.props.signature.id}`, 
    params, { 
    headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.showLoading(false)
      this.props.setSignature(res.data)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong updtae. Please try again.")
      this.props.showMessage(true)
      this.props.showLoading(false)
    })
  }

  deleteSignature = (forWho) => {
    token = this.props.token
    if (forWho === "Client" && this.props.signature !== null && this.props.signature.client_signature !== null) {
      params = {signature: {client_signature: '' }}
      this.removeSignature(params, token)
    }
    else if ( forWho === "User" && this.props.signature !== null && this.props.signature.user_signature !== null) {
      params = {signature: {user_signature: '' }}
      this.removeSignature(params, token)
    }
  }

  showClientSignature = () => {
    Alert.alert(
      'Client Signature',
      'What do you want to do?',
      [
        {text: 'Set Siganture', onPress: () => this.signature("Client")},
        {text: 'Delete Signature', onPress: () => this.deleteSignatureAlert("Client")},
        {text: 'Cancel', onPress: () => null, style: 'cancel'}
      ],
      { cancelable: true }
    )
  }

  showUserSignature = () => {
    this.props.showMessage(false)
    Alert.alert(
      'User Signature',
      'What do you want to do?',
      [
        {text: 'Set Siganture', onPress: () => this.signature("User")},
        {text: 'Delete Signature', onPress: () => this.deleteSignatureAlert("User")},
        {text: 'Cancel', onPress: () => null, style: 'cancel'}
      ],
      { cancelable: true }
    )
  }

  deleteSignatureAlert = (forWho) => {
    this.props.showMessage(false)
    Alert.alert(
      'Warning!',
      'Are you sure you want to delete this signature?',
      [
        {text: 'Delete', onPress: () => this.deleteSignature(forWho)},
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }
  
  signature = (forWho) => {
    this.props.navigator.showModal({
      screen: "abalogger.SignatureScreen",
      title: `Set ${forWho} Signature`,
      animationType: 'slide-up',
      passProps: {clientSelected: this.props.clientSelected, date: this.props.session.session_date, userSelected: this.props.userSelected, forWho: forWho, session_id: this.props.session.id},
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

  getBack = () => {
    this.props.showLoading(true)
    token = this.props.token
    client_id = this.props.clientSelected[0].id
    user_id = this.props.userSelected[0].id
    date = moment(this.props.date)
    axios.get(`${getDomain(this.props.domain)}/reports/user_hours_report`, {
      params: { client_id: client_id, user_id: user_id, config_range: true,
        start_day: moment(this.props.session.session_date).startOf("month").format("YYYY-MM-DD"),
        end_day: moment(this.props.session.session_date).endOf("month").format("YYYY-MM-DD")}, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.showLoading(false)
      this.props.setReportSessions(res.data)
      this.props.navigator.dismissModal({animationType: 'slide-down'})
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.showLoading(false)
    })
  }

  showImage = (image) => {
    if (this.props.signature !== null && this.props.session.session_instances.length > 0) {
      check = moment(this.props.session.session_instances.slice(-1)[0].created_at).isAfter(moment(this.props.signature.updated_at))
      if (check) {
        return (
          <Text>Siganture not shown because there are sessions created after client signed</Text>
        )
      }
      else {
        return (
          <Image style={styles.image} source={{uri: image}}/>
        )
      }
    }
  }

  render() {
    if (this.state.sessionInstance.length > 0) {
      clientbase64Icon = `data:image/png;base64`
      userbase64Icon = `data:image/png;base64`
      if (this.props.signature !== null) {
        clientbase64Icon = `data:image/png;base64,${this.props.signature.client_signature}`
        userbase64Icon = `data:image/png;base64,${this.props.signature.user_signature}`
      }
      if (this.props.signature !== null && moment(this.props.session.session_instances.slice(-1)[0].created_at).isAfter(moment(this.props.signature.updated_at))) {
        userImage = ( <View style={styles.signatureContainer}>   
                        <Image style={styles.image} source={{uri: userbase64Icon}}/>
                        <View style={styles.signature}>
                          <Text>RBT/BCaBA/BCBA Signature</Text>
                        </View>
                      </View> 
                    ) 
      }
      else {
        userImage = ( <TouchableOpacity style={styles.signatureContainer} onPress={() => this.showUserSignature()}>   
                        <Image style={styles.image} source={{uri: userbase64Icon}}/>
                        <View style={styles.signature}>
                          <Text>RBT/BCaBA/BCBA Signature</Text>
                        </View>
                      </TouchableOpacity> 
                    ) 
      }
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Client: {this.props.clientSelected[0].name}</Text>
            <Text style={styles.headerText}>User: {this.props.userSelected[0].name}</Text>
          </View>
          <View style={styles.tableContainer}>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                <Row data={this.state.tableHead} style={styles.cell} style={styles.header} textStyle={styles.text}/>
              </Table>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  this.state.sessionInstance.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      style={styles.cell}
                      style={[styles.row, index%2 && {backgroundColor: '#9E9E9E'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
          <View style={styles.ButtonContainer}>
            {userImage}
            <TouchableOpacity style={styles.signatureContainer} onPress={() => this.showClientSignature()}>
              {this.showImage(clientbase64Icon)}
              <View style={styles.signature}>
                <Text>Parent/Caregiver Signature</Text>
              </View>
            </TouchableOpacity>  
          </View>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => this.getBack()}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Loading/>
          <ShowMessage/>
        </View>
      )
    }
    else
      return (
        <View style={styles.container}>
          <View style={styles.showWarning}>
            <Icon name="sentiment-dissatisfied" size={60} />
            <Text style={styles.warning}>There is nothing to show on this date</Text>
            <Text style={styles.date}>{moment(this.props.session.session_date).format("MMM, YYYY")} </Text>
          </View>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigator.dismissModal({animationType: 'slide-down'})}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    alignItems: "center" 
  },
  headerContainer: {
    height: "8%",
    width: "90%",
    marginBottom: "2%",
    marginTop: "2%",
    backgroundColor: "#4080bf",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8
  },
  tableContainer: {
    width: "90%",
    height: "55%",
  },
  ButtonContainer: {
    flexDirection: "row",
    height: "23%",
    width: "90%",
    marginBottom: "5%"
  },
  backButtonContainer: {
    height: "30%",
    width: "90%"
  },
  cell: {
    width: "25%", 
  },
  header: {
    height: 50, 
    backgroundColor: '#4080bf' 
  },
  headerText: {
    color: "white"
  },
  text: { 
    textAlign: 'center'
  },
  dataWrapper: { 
    width: "100%"
  },
  row: { 
    height: 50,
    backgroundColor: '#E0E0E0' 
  },
  signatureContainer: {
    height: "100%",
    width: "48%",
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: "2%",
    marginTop: "2%"
  },
  image: {
    width: "95%",
    height: "95%",
    backgroundColor: "white",
  },
  signature: {
    position: "absolute",
    bottom: 5,
    width: "75%",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "black"
  },
  button: {
    width: "100%",
    height: "23%",
    backgroundColor: "#4080bf",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  showWarning: {
    width: "90%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center"
  },
  warning: {
    fontSize: 17,
    padding: 10,
    marginBottom: 5,
    color: "#1C2331"
  },
  date: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
    color: "#1C2331"
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    user: state.user.user,
    signature: state.signature.signature
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSignature: (signature) => dispatch(setSignature(signature)),
    removeSignature: () => dispatch(removeSignature()),
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (show) => dispatch(showMessage(show)),
    setReportSessions: (sessions) => dispatch(setReportSessions(sessions)),
    sendMessage: (text) => dispatch(message(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientReportModalScreen)