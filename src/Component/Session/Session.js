import React, { Component} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { setSessions, showMessage, message, loading }  from '../../store/actions/index'
import ShowSession from '../showSession/ShowSession'
import axios from 'axios'
import ShowMessage from '../ShowMessage/ShowMessage'
import moment from "moment"
import getDomain from '../../lib/domain'



class Session extends Component {

  componentWillMount() {
    token = this.props.token
    client_id = this.props.selectedClient.id
    date = this.props.date
    axios.get(`${getDomain(this.props.domain)}/sessions`, {
      params: { client_id , date }, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.setSessions(res.data)
      this.props.ShowLoading(false)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.ShowLoading(false)
    })
  }

  get_instances = (sessions) => {
    instances = []
    for (session of this.props.sessions) {
      for (instance of session.session_instances) {
        instances.push({instance: instance, user: session.user, locked: session.locked})
      }
    }
    return instances
  }

  render() {
    if (this.props.sessions.length > 0 && !this.props.loading) {
      instances = this.get_instances(this.props.sessions)
      addButton = null
      if (!instances[0].locked) {
        addButton = (<TouchableOpacity onPress={this.props.createSession} style={styles.button}>
                        <Icon name="add-circle" size={60} color="#00BFA5"/>
                      </TouchableOpacity>
                    )
      }
      return (
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Working on {moment(this.props.date).format("MMM, DD YYYY")}</Text>
          </View>
          <FlatList
              style={styles.listContainer}
              data={instances}
              renderItem={(info) => (
                <ShowSession
                  session={info.item}
                  onSessionPressed={() => this.props.onSessionPressed(info.item)}
                />
              )}
              keyExtractor={(item, index) => index}
            />
            {addButton}
        </View>
      )

    }
    else if (this.props.sessions.length === 0 && !this.props.loading) {
      return (
        <View style={styles.warningContainer}>
          <View style={styles.showWarning}>
            <Icon name="sentiment-dissatisfied" size={60} />
            <Text style={styles.warning}>There are no sessions to show on this date</Text>
            <Text style={styles.date}>{moment(this.props.date).format("MMM, DD YYYY")} </Text>
          </View>
          <TouchableOpacity onPress={this.props.createSession} style={styles.button}>
            <Icon name="add-circle" size={60} color="#00BFA5"/>
          </TouchableOpacity>
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
  listContainer: {
    width: "100%",
    marginTop: 5
  },
  button: {
   position: "absolute",
   bottom: 10,
   right: 10
  },
  warningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  showWarning: {
    width: "95%",
    height: "50%",
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
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    selectedClient: state.clients.selectedClient,
    date: state.calendar.date,
    sessions: state.sessions.sessions,
    loading: state.loading.animate
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
    setSessions: (sessions) => dispatch(setSessions(sessions)),
    ShowLoading: (animate) => dispatch(loading(animate)),
    showMessage: (action) => dispatch(showMessage(action)),
    sendMessage: (sms) => dispatch(message(sms))
  }
}


export default connect(mapStateToProps, mapDispacthToProps)(Session)