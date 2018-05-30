import React, { Component} from 'react'
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import MonthPicker from 'react-native-month-selector'
import getDomain from '../../lib/domain'
import { connect } from 'react-redux'
import filterClientPerPlan from '../../lib/filterClientPerPlan'
import { setReportDate, setReportClients, loading, message, showMessage, removeReportClients, removeReportUsers } from '../../store/actions/index'
import moment from 'moment'
import axios from 'axios'
import Loading from '../../Component/Loading/Loading'
import ShowMessage from '../../Component/ShowMessage/ShowMessage'

class MonthScreen extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.removeReportClients()
    this.props.removeReportUsers()
  }

  setDate = (date) => {
    date = moment(date).format("YYYY-MM-DD")
    this.props.showLoading(true)
    token = this.props.token
    user = this.props.user
    axios.get(`${getDomain(this.props.domain)}/clients`, {
      params: { user_id: user.id }, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      clients = filterClientPerPlan(res.data, user, date)
      this.props.setReportClients(clients)
      this.props.showLoading(false)
      this.props.setReportDate(date)
      this.props.navigator.dismissModal({animationType: 'slide-down'})
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.showLoading(false)
    })
  }

 render() {
  
    return (
      <View style={styles.superContainer}>
        <MonthPicker
          maxDate={moment().endOf("year")}
          monthTapped={(date) => this.setDate(date)}
        />
        <View style={styles.backButton}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigator.dismissModal({animationType: 'slide-down'})}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Loading/>
        <ShowMessage/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: "#ecf2f9",
  },
  backButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#4080bf",
    borderRadius: 5,
    margin: "5%",
    marginTop: "10%"
  },
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
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

const mapDispacthToProps = (dispatch) => {
  return {
    setReportDate: (date) => dispatch(setReportDate(date)),
    setReportClients: (clients) => dispatch(setReportClients(clients)),
    removeReportUsers: () => dispatch(removeReportUsers()),
    removeReportClients: () => dispatch(removeReportClients()),
    showLoading: (animate) => dispatch(loading(animate)),
    showMessage: (show) => dispatch(showMessage(show)),
    sendMessage: (text) => dispatch(message(text))
  }
}


export default connect(mapStateToProps, mapDispacthToProps)(MonthScreen)