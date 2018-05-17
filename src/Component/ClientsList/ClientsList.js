import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { setClients, selectClient, message, showMessage, loading } from '../../store/actions/index'
import filterClientPerPlan from '../../lib/filterClientPerPlan'
import ShowClient from '../ShowClient/ShowClient'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import ShowMessage from '../ShowMessage/ShowMessage'
import getDomain from '../../lib/domain'

class ClientsList extends Component {

  componentWillMount() {
    user = this.props.user
    user_id = user.id
    token = this.props.token
    date = this.props.date
    axios.get(`${getDomain(this.props.domain)}/clients`, {
      params: { user_id: user_id }, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      clients = filterClientPerPlan(res.data, user, date)
      this.props.setClients(clients)
      this.props.ShowLoading(false)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.ShowLoading(false)
    })
  }

  render() {
    if (this.props.clients.length > 0 && !this.props.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Working on {moment(this.props.date).format("MMM, DD YYYY")}</Text>
          </View>
          <FlatList
            style={styles.listContainer}
            data={this.props.clients}
            renderItem={(info) => (
              <ShowClient
                client={info.item}
                onClientPressed={() => this.props.onClientPressed(info.item.id)}
              />
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      )
    }
    else if (this.props.clients.length === 0 && !this.props.loading) {
      return (
        <View style={styles.warningContainer}>
          <View style={styles.showWarning}>
            <Icon name="group" size={60} />
            <Text style={styles.warning}>There are no clients to show on this date </Text>
            <Text style={styles.date}>{moment(this.props.date).format("MMM, DD YYYY")} </Text>
          </View>
          <ShowMessage/>
        </View>
      )
    }
    else
      return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  warningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listContainer: {
    width: "100%"
  },
  showWarning: {
    width: "95%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginBottom: 10
  },
  date: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
    color: "#1C2331"
  },
  warning: {
    fontSize: 18,
    padding: 10,
    marginBottom: 5,
    color: "#1C2331"
  },
  dateContainer: {
    height: 35,
    width: "50%",
    marginTop: 10,
    backgroundColor: "#4080bf",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8
  },
  dateText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: "white"
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    token: state.auth.token,
    domain: state.auth.domain,
    clients: state.clients.clients,
    date: state.calendar.date,
    loading: state.loading.animate
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setClients: (clients) => dispatch(setClients(clients)),
    ShowLoading: (animate) => dispatch(loading(animate)),
    selectClient: (client) => dispatch(selectClient(client)),
    showMessage: (action) => dispatch(showMessage(action)),
    sendMessage: (sms) => dispatch(message(sms))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ClientsList)