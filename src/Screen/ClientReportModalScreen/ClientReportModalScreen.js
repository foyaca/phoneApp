import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert} from 'react-native'
import { Table, TableWrapper, Row } from 'react-native-table-component'
import {connect} from 'react-redux'
import { setSignature, removeSignature, setReportSessions } from '../../store/actions/index'
import { loading, message, showMessage }  from '../../store/actions/index'
import moment from 'moment'
import getDomain from '../../lib/domain'
import axios from 'axios'
import Loading from '../../Component/Loading/Loading'
import ShowMessage from '../../Component/ShowMessage/ShowMessage'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ClientReportModalScreen extends Component {
  state = {
    tableHead: ["Session Date", "Signed?"]
  }

  componentWillMount() {
    this.props.removeSignature()
    this.props.showLoading(true)
    token = this.props.token
    client_id = this.props.clientSelected[0].id
    user_id = this.props.userSelected[0].id
    date = moment(this.props.date)
    axios.get(`${getDomain(this.props.domain)}/reports/user_hours_report`, {
      params: { client_id: client_id, user_id: user_id, config_range: true,
        start_day: date.startOf("month").format("YYYY-MM-DD"), end_day: date.endOf("month").format("YYYY-MM-DD")}, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.showLoading(false)
      this.props.setReportSessions(res.data)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.showLoading(false)
    })
  }

  getSessionObject = (sessions) => {
    total = 0
    array = []
    for (session of sessions) {
      array.push([ moment(session.session_date).format("ddd MMM, DD YYYY"), session.signature !== null ? "YES" : "NO", session.id])
    }
    return array
  }
  
  getSignature = (session_id) => {
    this.props.sessions.filter((s) => {
      if (s.id === session_id) {
        session = s
        return
      }
    })
    this.props.navigator.showModal({
      screen: "abalogger.ClientReportSignatureScreen",
      title: "Signature",
      animationType: 'slide-up',
      passProps: {session: session, clientSelected: this.props.clientSelected, 
        userSelected: this.props.userSelected},
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

  render() {
    if (this.props.sessions.length > 0) {
      sessions = this.getSessionObject(this.props.sessions)
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
                  sessions.map((rowData, index) => (
                    <TouchableOpacity onPress={() => this.getSignature(rowData[2])}>
                      <Row
                        key={index}
                        data={rowData.slice(0,2)}
                        style={styles.cell}
                        style={[styles.row, index%2 && {backgroundColor: '#9E9E9E'}]}
                        textStyle={styles.text}
                      />
                    </TouchableOpacity>  
                  ))
                }
              </Table>
            </ScrollView>
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
    else
      return (
        <View style={styles.container}>
          <View style={styles.showWarning}>
            <Icon name="sentiment-dissatisfied" size={60} />
            <Text style={styles.warning}>There is nothing to show on this month</Text>
            <Text style={styles.date}>{moment(this.props.date).format("MMM, YYYY")} </Text>
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
    height: "78%",
    marginBottom: "3%"
  },
  backButtonContainer: {
    height: "35%",
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
    signature: state.signature.signature,
    sessions: state.report.reportSessions
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