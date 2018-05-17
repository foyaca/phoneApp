import React, { Component } from 'react'
import { View, Modal, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import TimePicker from 'react-native-modal-datetime-picker'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Select from 'react-native-picker-select'
import { setSessions }  from '../../store/actions/index'
import moment from 'moment'
import getDomain from '../../lib/domain'
import axios from 'axios'

class SessionModalScreen extends Component {
  state = {
    caregiver_training: (this.props.instance !== null && this.props.edit) ? this.props.instance.instance.caregiver_training : false,
    start_time: (this.props.instance !== null && this.props.edit) ?  moment(this.props.instance.instance.start_time).utc().format("hh:mm A") : moment().format("hh:mm A"),
    end_time: (this.props.instance !== null && this.props.edit) ?  moment(this.props.instance.instance.end_time).utc().format("hh:mm A") : moment().add(15, "minutes").format("hh:mm A"),
    showTimer: {show: false, forwho: " "},
    users: [],
    selectedUser: (this.props.instance !== null && this.props.edit) ? this.props.instance.user.id : null,
    showCaregiverTraining: (this.props.instance !== null && this.props.edit && this.props.user.role[0] === "admin" && this.props.instance.user.roles[0] != "RBT") ? true : false,
    selectedpos: (this.props.instance !== null && this.props.edit) ? this.props.client.pos[this.props.instance.instance.place_of_service] : null
  }

  componentWillMount() {
    if (this.props.user.role[0] === "admin") {
      token = this.props.token
      client_id = this.props.client.id
      date = this.props.date
      axios.get(`${getDomain(this.props.domain)}/users/get_users_by_client`, {
        params: { client_id , date }, 
        headers: {Authorization: `${token}`}
      }).then(res =>{
        this.setState({users: res.data})
      }).catch(error => {
        console.log(error)
      })
    }
  }

  constructor(props) {
    super(props)
  }

  submit = () => {
    if (this.state.selectedpos === null) {
      Alert.alert(
        'Error',
        'Select a place of service',
        [
          {text: 'OK', onPress: () => null, style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    if (this.props.user.role[0] === "admin" && this.state.selectedUser === null) {
      Alert.alert(
        'Error',
        'Select an user to continue',
        [
          {text: 'OK', onPress: () => null, style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    token = this.props.token
    user_id = (this.props.user.role[0] === "admin") ? this.state.selectedUser : this.props.user.id
    params = {date: this.props.date, user_id: user_id, client_id: this.props.client.id,
    session_instance: { place_of_service: this.state.selectedpos, caregiver_training: this.state.caregiver_training, start_time: this.state.start_time, end_time: this.state.end_time}}
    if (this.props.edit)
      axios.patch(`${getDomain(this.props.domain)}/sessions/${this.props.instance.instance.id}`,
        params, { 
        headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.setSessions(res.data)
          this.setState({caregiver_training: false, selectedUser: null, showCaregiverTraining: false, selectedpos: null})
          this.props.navigator.dismissModal({animationType: 'slide-down'})
        }).catch(error => {
          console.log(error.response)
          Alert.alert(
            'Error',
            error.response.data.join(", "),
            [
              {text: 'OK', onPress: () => null, style: 'cancel'}
            ],
            { cancelable: false }
          )
      })
    else
      axios.post(`${getDomain(this.props.domain)}/sessions`,
        params, { 
        headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.setSessions(res.data)
          this.setState({caregiver_training: false, selectedUser: null, showCaregiverTraining: false, selectedpos: null})
          this.props.navigator.dismissModal({animationType: 'slide-down'})
        }).catch(error => {
          console.log(error.response)
          Alert.alert(
            'Error',
            error.response.data.join(", "),
            [
              {text: 'OK', onPress: () => null, style: 'cancel'}
            ],
            { cancelable: false }
          )
      })
  }

  setTimer = (time) => {
    if (this.state.showTimer.forwho === "start") {
      start_time = moment(time).format("hh:mm A")
      end_time = this.state.end_time
      this.setState({start_time: start_time})
    }
    else
      this.setState({end_time: moment(time).format("hh:mm A")})

    this.setState({showTimer: { show: false, forwho: " "}})
  }

  setUser = (value) => {
    this.setState({selectedUser: value})
    if (value === null)
      this.setState({showCaregiverTraining: false})
    if (this.props.user.role[0] === "admin") {
      for (user of this.state.users) {
        if (user.id === value && user.roles[0] !== "RBT") {
          this.setState({showCaregiverTraining: true})
          return
        }
      }
    }
    this.setState({showCaregiverTraining: false})
  }

  setPos = () => {
    pos = []
    for (p in this.props.client.pos)
      pos.push({label: p, value: this.props.client.pos[p], key: this.props.client.pos[p]})
    return pos
  }

  close = () => {
    this.setState({caregiver_training: false, selectedUser: null, showCaregiverTraining: false, selectedpos: null})
    this.props.navigator.dismissModal({animationType: 'slide-down'})
  }

  render() {
    caregiver_training = null
    users = null 
    place_of_service = null
    userName = null
    if (this.props.user.role[0] === "admin" && this.state.users.length > 0 && this.props.edit)
    userName = (<View style={styles.userNameContainer}> 
                  <Text style={styles.userName}>User name:  {this.props.instance.user.name}</Text>
                </View>)
    place_of_service = ( 
            <View style={styles.serviceContainer}>
              <Select
              placeholder={{ label: "Select place of service", value: null }}
              value={this.state.selectedpos}
              style={{inputIOS: {color: "black",  padding: 10, borderBottomWidth: 0.5, borderBottomColor: "black", height: 50, width: "100%"},
              inputAndroid: {color: "black", padding: 10, borderBottomWidth: 0.5, borderColor: "black", height: 50, width: "100%"}}}
              items={this.setPos()}
              onValueChange={(value) => this.setState({selectedpos: value})}/>
            </View>)
    if (this.props.user.role[0] === "admin" && this.state.users.length > 0 && !this.props.edit)             
      users = ( 
              <View style={styles.serviceContainer}>
                <Select
                placeholder={{ label: "Select user", value: null }}
                value={this.state.selectedUser}
                style={{inputIOS: {color: "black",  padding: 10, borderBottomWidth: 0.5, borderBottomColor: "black", height: 50, width: "100%"},
                inputAndroid: {color: "black", padding: 10, borderBottomWidth: 0.5, borderColor: "black", height: 50, width: "100%"}}}
                items={this.state.users.map(u => ({ label: u.name, value: u.id, key: u.id }))}
                onValueChange={(value) => this.setUser(value)}/>
              </View>)
    if (this.state.showCaregiverTraining || (this.props.user.role[0] !== "admin" && this.props.user.role[0] !== "RBT"))
      caregiver_training = ( 
                  <View style={styles.serviceContainer}>
                    <Select
                    placeholder={{ label: "Select Service", value: null }}
                    value={this.state.caregiver_training}
                    style={{inputIOS: {color: "black",  padding: 10, borderBottomWidth: 0.5, borderBottomColor: "black", height: 50, width: "100%", fontSize: 12},
                    inputAndroid: {color: "black", padding: 10, borderBottomWidth: 0.5, borderColor: "black", height: 50, width: "100%"}}}
                    items={[{ label: "BA Service", value: false, key: 1 }, { label: "Caregiver Training", value: true, key: 2}]}
                    onValueChange={(value) => this.setState({caregiver_training: value})}/>
                  </View>)
    return (
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <TimePicker
            mode="time"
            minuteInterval={15}
            is24Hour={false}
            isVisible={this.state.showTimer.show}
            onConfirm={(time) => this.setTimer(time)}
            onCancel={() => this.setState({showTimer: { show: false, forwho: " "}})}
          />
          { userName }
          { place_of_service }
          { users }
          { caregiver_training }
          <View style={styles.containerTimer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>From</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.clientBox}>{this.state.start_time}</Text>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity onPress={() => this.setState({showTimer: { show: true, forwho: "start"}})}>
                <Icon name="alarm" size={25} style={styles.icons} color="#00264d"/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerTimer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>To</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.clientBox}>{this.state.end_time}</Text>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity onPress={() => this.setState({showTimer: { show: true, forwho: "end"}})}>
                <Icon name="alarm" size={25} style={styles.icons} color="#00264d"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => this.close()}>
            <Text style={styles.button}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButtonContainer} onPress={() => this.submit() }>
            <Text style={styles.button}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
  formContainer: {
    width: "90%",
    height: "81.5%",
    margin: "5%",
    backgroundColor: "#ecf2f9",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    height: "10%",
    width: "100%"
  },
  cancelButtonContainer: {
    backgroundColor: "#E87A49",
    height: "100%",
    width: "42.5%",
    marginLeft: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  addButtonContainer: {
    backgroundColor: "#00BFA5",
    height: "100%",
    width: "42.5%",
    marginLeft: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  button: {
    color: "white",
    fontSize: 14,
    borderRadius: 5
  },
  serviceContainer: {
    width: "90%",
    margin: "2%",
    marginBottom: "10%",
  },
  containerTimer: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    height: 47,
    marginBottom: 0
  },
  labelContainer: {
    width: "15%",
    height: "100%",
    marginLeft: "5%",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 18,
    fontWeight: "bold"
  },
  listItem: {
    width: "55%",
    height: "100%",
    paddingLeft: 20,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    borderRadius: 3,
    marginLeft: "5%",
    borderWidth: 1,
    borderColor: "#757575"
  },
  clientBox: {
    fontSize: 18,
    color: "#00264d",
    justifyContent: "center",
  },
  icon: {
    width: "15%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#757575"
  },
  userNameContainer: {
    width: "90%",
    margin: "5%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    color: "#00264d",
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    date: state.calendar.date,
    user: state.user.user,
    client: state.clients.selectedClient,
    sessions: state.sessions.sessions,
    instance: state.sessions.instance
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    setSessions: (sessions) => dispatch(setSessions(sessions))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(SessionModalScreen)