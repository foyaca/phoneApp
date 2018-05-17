import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import getDomain from '../../lib/domain'
import { connect } from 'react-redux'
import filterClientPerPlan from '../../lib/filterClientPerPlan'
import Select from 'react-native-picker-select'
import { loading, message, showMessage }  from '../../store/actions/index'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import moment from 'moment'
import TimePicker from 'react-native-modal-datetime-picker'
import Loading from '../Loading/Loading'
import ShowMessage from '../ShowMessage/ShowMessage'

class Report extends Component {
  state = {
    clients: [],
    selectedClient: null,
    showDate: false,
    date: moment().format("YYYY-MM-DD"),
    users: [],
    selectedUser: (this.props.user !== undefined && this.props.user.role[0] === "admin") ? null : this.props.user.id
  }

  componentWillMount() {
    this.getClients()
  }

  getClients = () => {
    this.props.showLoading(true)
    user = this.props.user
    user_id = user.id
    token = this.props.token
    date = this.state.date
    axios.get(`${getDomain(this.props.domain)}/clients`, {
      params: { user_id: user_id }, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      clients = filterClientPerPlan(res.data, user, date)
      this.setState({clients: clients})
      this.props.showLoading(false)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.showLoading(false)
    })
  }

  setDate = (date) => {
    this.setState({clients: [], selectedClient: null})
    this.setState({users: []})
    this.setState({date: date, showDate: false})
    this.getClients()
  }

  setClient = (id) => {
    this.setState({selectedClient: id})
    if (this.props.user.role[0] === "admin") {
      this.props.showLoading(true)
      this.setState({users: []})
      token = this.props.token
      client_id = id
      date = this.state.date
      axios.get(`${getDomain(this.props.domain)}/users/get_users_by_client`, {
        params: { client_id , date }, 
        headers: {Authorization: `${token}`}
      }).then(res =>{
        this.setState({users: res.data})
        this.props.showLoading(false)
      }).catch(error => {
        console.log(error)
      })
    }
  }

  getClient = () => {
    client = this.state.clients.filter(c=> {
      if (this.state.selectedClient === c.id)
        return c
    })
    return client
  }

  getUser = () => {
    if (this.props.user.role[0] === "admin") {
      user = this.state.users.filter(u=> {
        if (this.state.selectedUser === u.id)
          return u
      })
      return user
    }
    return [this.props.user]
  }

  submit = () => {
    if (this.state.selectedClient === null) {
      Alert.alert(
        'Error',
        'Select a client to continue',
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
    this.props.getReport(this.getClient(), this.state.date, this.getUser())
  }

  render() {
    clients = null
    users = null
    if (this.state.clients.length> 0)
      clients = (<View style={styles.serviceContainer}>
                  <Select
                    placeholder={{ label: "Select Client", value: null }}
                    value={this.state.selectedClient}
                    style={{inputIOS: {color: "black", paddingLeft: 20, borderBottomWidth: 0.5, borderBottomColor: "black", height: 50, width: "100%", fontSize: 18},
                    inputAndroid: {color: "black", paddingLeft: 20, borderBottomWidth: 0.5, borderColor: "black", height: 50, width: "100%"}}}
                    items={this.state.clients.map( client => ({ label: client.name, value: client.id, key: client.id }) )}
                    onValueChange={(value) => this.setClient(value)}/>
                  </View>
                )
    if (this.props.user.role !== undefined && this.props.user.role[0] === "admin" && this.state.users.length > 0)             
      users = (<View style={styles.serviceContainer}>
                <Select
                  placeholder={{ label: "Select user", value: null }}
                  value={this.state.selectedUser}
                  style={{inputIOS: {color: "black", paddingLeft: 20, borderBottomWidth: 0.5, borderBottomColor: "black", height: 50, width: "100%", fontSize: 18},
                  inputAndroid: {color: "black", paddingLeft: 20, borderBottomWidth: 0.5, borderColor: "black", height: 50, width: "100%"}}}
                  items={this.state.users.map(u => ({ label: u.name, value: u.id, key: u.id }))}
                  onValueChange={(value) => this.setState({selectedUser: value})}/>
                </View>
              )            
    return (
      <View style={styles.container}>
        <TimePicker
          mode="date"
          isVisible={this.state.showDate}
          onConfirm={(date) => this.setDate(date)}
          onCancel={() => this.setState({showDate: false})}
        />
        <View style={styles.dateContainer}>
          <View style={styles.dateText}>
            <Text style={styles.date}>{moment(this.state.date).format("MMM, YYYY")}</Text>
          </View>
          <TouchableOpacity style={styles.icon} onPress={() => this.setState({showDate: true}) }>
             <Icon name="date-range" size={25} color="#616161" />
          </TouchableOpacity>
        </View>
        { clients }
        { users }
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.button} onPress={() => this.submit()}>
            <Text style={styles.submitText}>Get Report</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    height: 50,
    width: "90%",
    margin: "5%",
    borderBottomWidth: 0.5,
    borderBottomColor: "#616161",
  },
  serviceContainer: {
    width: "90%",
    margin: "5%",
  },
  dateText: {
    width: "85%",
    height: 50,
    justifyContent: "center",
    paddingLeft: 20
  },
  date: {
    fontSize: 18,
    color: "#424242"
  },
  icon: {
    width: "15%",
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  submitContainer: {
    width: "70%",
    height: 50,
    backgroundColor: "#4080bf",
    borderRadius: 5,
    marginTop: "10%"
  },
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 18,
    color: "#fff"
  }
})

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    token: state.auth.token,
    domain: state.auth.domain
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (show) => dispatch(showMessage(show)),
    sendMessage: (text) => dispatch(message(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)