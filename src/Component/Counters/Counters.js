import React, { Component } from 'react'
import { View, FlatList, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native"
import Select from 'react-native-picker-select'
import { connect } from 'react-redux'
import { setCounters, selectCounter, showMessage, message, loading } from '../../store/actions/index'
import getDomain from '../../lib/domain'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import moment from 'moment'
import ShowMessage from '../ShowMessage/ShowMessage'
import CheckBox from 'react-native-checkbox';

class Counters extends Component {
  state = {
    timeValue: ""
  }
  
  componentWillMount() {
    token = this.props.token
    session_id = this.props.session.id
    date = this.props.date
    axios.get(`${getDomain(this.props.domain)}/behavior_counters`, {
      params: { session_id }, 
      headers: {Authorization: `${token}`}
    }).then(res =>{
      this.props.setCounters(res.data)
      this.props.ShowLoading(false)
    }).catch(error => {
      console.log(error)
      this.props.sendMessage("Something went wrong. Please try again.")
      this.props.showMessage(true)
      this.props.ShowLoading(false)
    })
  }

  getLongTermObject = (id) => {
    lto = this.props.counters.filter(c => {
      if (c.id === id) {
        return c
      }
    })
    this.props.selectCounter(lto)
    this.props.showMessage(false)
  }

  getLongTermObjectRequest = (counters) => {
    lto = counters.filter(c => {
      if (c.id === this.props.counter[0].id) {
        return c
      }
    })
    this.props.selectCounter(lto)
    this.props.showMessage(false)
  }

  removeAlert = (id, noData) => {
    if (!noData)
      Alert.alert(
        'Delete',
        'Are you sure you want to delete this counter?',
        [
          {text: 'Cancel', onPress: () => null, style: 'cancel'},
          {text: 'Delete', onPress: () => this.requestTime("delete", null, id, noData)},
        ],
        { cancelable: false }
      )

  }

  getTimesConuter = (timesCounters, id) => {
    behavior_times = []
    for (time of timesCounters) {
      if (id === time.behavior_counter_id)
        behavior_times.push(time)
    }
    return behavior_times
  }

  onAddTimeHandler = (val) => {
    this.setState({timeValue: val})
  }

  axiosRequest = (type, params, id) => {
    token = this.props.token
    if (type === "delete")
      axios.delete(`${getDomain(this.props.domain)}/behavior_counters/${id}`, { 
        headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.setCounters(res.data)
          this.getLongTermObjectRequest(res.data)
        }).catch(error => {
          console.log(error)
          this.props.sendMessage("Something went wrong. Please try again.")
          this.props.showMessage(true)
      })
    else if (type === "create")
      axios.post(`${getDomain(this.props.domain)}/behavior_counters`, 
        params, { 
        headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.setCounters(res.data)
          this.getLongTermObjectRequest(res.data)
        }).catch(error => {
          console.log(error)
          this.props.sendMessage("Something went wrong. Please try again.")
          this.props.showMessage(true)
      })
    else
      axios.patch(`${getDomain(this.props.domain)}/behavior_counters/${id}`,
        params, {
        headers: {Authorization: `${token}`}
        }).then(res =>{
          this.props.setCounters(res.data)
          this.getLongTermObjectRequest(res.data)
        }).catch(error => {
          console.log(error)
          this.props.sendMessage("Something went wrong. Please try again.")
          this.props.showMessage(true)
      })
  }

  request = (type, key, counter_id, trials, count, noData, id, action, yAxis = "") => {
    if (key !== "no_data" && noData)
      return
    if (key === "trials")
      if (action === "increase")
        trials = (trials || 0) + 1
      else
        if (yAxis === "percent" && count === trials)
          return
        else
          trials = ((!trials || trials < 1) ? 1 : trials) - 1
    else if (key === "count")
      if (action === "increase")
        if (yAxis === "percent" && count === trials)
          return
        else
          count = (count || 0) + 1
      else
        count = ((!count || count < 1) ? 1 : count) - 1
    params = { behavior_counter: {count: count, trials: trials, no_data: noData, long_term_obj_id: counter_id, session_date: this.props.date }}
    this.axiosRequest(type, params, id)
  }


  requestTime = (type, counter_id, id, noData, key = "") => {
    if (key !== "no_data" && noData) 
      return
    if (type !== "delete")
      if (key !== "no_data")
        params = {behavior_counter: { no_data: noData, long_term_obj_id: counter_id, session_date: this.props.date, behavior_times_attributes: { id: "", time: this.state.timeValue }}}
      else
        params = {behavior_counter: { no_data: noData }}
    else
      params = { id: id}
    this.setState({timeValue: ""})
    this.axiosRequest(type, params, id)
  }

  frecuencyCounter = (action, counter, c) => {
    return (
      <View style={styles.countContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerType}>{counter[0].behavior_type}</Text>
          <Text style={styles.header}>{counter[0].type}</Text>
        </View>
        <View style={styles.wrapButton}>
          <CheckBox
          labelStyle={{fontSize: 18}}
            label='No Data'
            checked={c.no_data}
            onChange={(checked) => this.request(action, "no_data", counter[0].id, c.trials, c.count, !checked, c.id, "no_data")}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => this.request(action, "count", counter[0].id, c.trials, c.count, c.no_data, c.id, "decrease")}>
              <Icon name="remove-circle-outline" color="#E87A49" size={40} />
            </TouchableOpacity>
            <Text style={styles.showCounter}>Count: {c.count}</Text>
            <TouchableOpacity onPress={() => this.request(action, "count",  counter[0].id, c.trials, c.count, c.no_data, c.id, "increase")}>
              <Icon name="add-circle-outline" color="#00BFA5" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  percentCounter = (action, counter, c) => {
    return (
      <View style={styles.countContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerType}>{counter[0].behavior_type}</Text>
          <Text style={styles.header}>{counter[0].type}</Text>
        </View>
        <View style={styles.wrapButton}>
          <CheckBox
            labelStyle={{fontSize: 18}}
            label='No Data'
            checked={c.no_data}
            onChange={(checked) => this.request(action, "no_data", counter[0].id, c.trials, c.count, !checked, c.id, "no_data")}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => this.request(action, "trials", counter[0].id, c.trials, c.count, c.no_data, c.id, "decrease", "percent")}>
              <Icon name="remove-circle-outline" color="#E87A49" size={40} />
            </TouchableOpacity>
            <Text style={styles.showCounter}>Trials Attempted: {c.trials}</Text>
            <TouchableOpacity onPress={() => this.request(action, "trials", counter[0].id, c.trials, c.count, c.no_data, c.id, "increase", "percent")}>
             <Icon name="add-circle-outline" color="#00BFA5" size={40} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => this.request(action, "count", counter[0].id, c.trials, c.count, c.no_data, c.id, "decrease", "percent")}>
              <Icon name="remove-circle-outline" color="#E87A49" size={40} />
            </TouchableOpacity>
            <Text style={styles.showCounter}>Trials Completed: {c.count}</Text>
            <TouchableOpacity onPress={() => this.request(action, "count", counter[0].id, c.trials, c.count, c.no_data, c.id, "increase", "percent")}>
              <Icon name="add-circle-outline" color="#00BFA5" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  durationCounter = (action, counter, c) => {
    return (
      <View key={counter[0].id} style={styles.countContainer}>
        <View style={styles.headerContainer}> 
          <Text style={styles.headerType}>{counter[0].behavior_type}</Text>
          <Text style={styles.header}>{counter[0].type}</Text>
        </View>
        <View style={styles.wrapButton}>
          <View style={styles.ScrollContainer}>
            <CheckBox
              checkboxStyle={{marginTop: 18, marginLeft: "34.9%", borderColor: "#ecf2f9"}}
              labelStyle={{marginTop: 18, fontSize: 18}}
              label='No Data'
              checked={c.no_data}
              onChange={(checked) => this.requestTime(action, null, c.id, !checked, "no_data")}
            />
            <View style={styles.buttonScrollContainer}>
              <TextInput style={styles.textInput} underlineColorAndroid='white' value={this.state.timeValue}
                placeholder="Insert time" onChangeText={this.onAddTimeHandler} keyboardType='numeric'/>
              <TouchableOpacity onPress={() => this.requestTime(action, counter[0].id, c.id, c.no_data)}>
                <Icon name="add-circle-outline" color="#00BFA5" size={45} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.getTimesConuter(counter[0].behavior_times, c.id)}
              renderItem={(time) => (
                <View key={time.item.id} style={styles.listItems}>
                  <Text style={styles.showCounterScroll}>Duration: {time.item.time}s</Text>
                  <TouchableOpacity onPress={() => this.removeAlert(time.item.id, c.no_data)}>
                    <Icon name="delete-forever" color="#E87A49" size={30} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      </View>
    )
  }

  selectBehavior = () => {
    return (
      <View style={styles.countContainer}>
          <View style={styles.headerContainer}>
          <Text style={styles.headerType}>Select behavior...</Text>
        </View>
        <View style={styles.wrapButton}>
          <View style={styles.buttonContainerBlank}>
            <Text style={styles.showCounter}>Select behavior...</Text>
          </View>
        </View>
        <ShowMessage/>
      </View>
    )
  }

  renderAddButton = (action,counter, c = {}) => {
    if (counter[0].y_axis === "Duration")
      return this.durationCounter(action, counter, c)
    else {
      if (counter[0].y_axis === "Frequency")
        return this.frecuencyCounter(action, counter, c)
      else
        return this.percentCounter(action, counter, c)
    }
  }

  getCounterView = (counter) => {
    if (counter !== null && counter[0] !== undefined) {
      if (counter[0].behavior_counters.length == 0)
        return this.renderAddButton("create", counter)
      for (c of counter[0].behavior_counters) {
        if (moment(this.props.date).isSame(c.session_date))
          return this.renderAddButton("update",counter, c)
      }
      return this.renderAddButton("create", counter)
    }
    else
      return this.selectBehavior()
  }

  render() {
    if (this.props.counters.length > 0 && !this.props.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Working on {moment(this.props.date).format("MMM, DD YYYY")}</Text>
            </View>
            <Select
              placeholder={{label: " Click here to select behavior...", value: null}}
              style={{inputIOS: { color: "white", padding: 20, borderBottomWidth: 0.5, borderBottomColor: "#E0E0E0", height: 50, width: "100%", fontSize: 12},
              inputAndroid: {color: "white", padding: 20, borderBottomWidth: 0.5, borderColor: "#E0E0E0", height: 50, width: "100%"}}}
              items={this.props.counters.map(counter => ({ label: counter.type, value: counter.id, key: counter.id }))}
              onValueChange={(value) => this.getLongTermObject(value)}/>
          </View>
          <View style={styles.infoContainer}>
            { this.getCounterView(this.props.counter) }
          </View>
          <ShowMessage/>
        </View>
      )
    }
    else if (this.props.counters.length === 0 && !this.props.loading) {
      return (
        <View style={styles.warningContainer}>
          <View style={styles.showWarning}>
            <Icon name="sentiment-dissatisfied" size={60} />
            <Text style={styles.warning}>There are no Lto to show on this date</Text>
            <Text style={styles.date}>{moment(this.props.date).format("MMM, DD YYYY")} </Text>
          </View>
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
    backgroundColor: "#ecf2f9"
  },
  pickerContainer: {
    width: "100%",
    height: "40%",
    backgroundColor: "#00537B",
    padding: "10%"
  },
  infoContainer: {
    height: "68%",
    width: "90%",
    marginLeft: "5%",
    marginTop: -60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  countContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  headerContainer: {
    backgroundColor: "#E0E0E0",
    width: "100%",
    height: "35%"
  },
  headerType: {
    fontSize: 30,
    textAlign: "center",
    color: "#00264d",
    marginTop: 10
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    color: "#00264d",
    padding: 10
  }, 
  wrapButton: {
    width: "100%",
    height: "70%",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainer: {
    width: "100%",
    height: "33%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonScrollContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4
  },
  ScrollContainer: {
    width: "100%",
    height: "100%"
  },
  listItems: {
    width: "80%",
    flexDirection: "row",
    marginLeft: "10%",
    padding: 20,
    paddingBottom: 10,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: "black"
  },
  buttonContainerBlank: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  },
  showCounter: {
    fontSize: 20,
    marginRight: 20,
    marginLeft: 20,
    paddingBottom: 10

  },
  textInput: {
    paddingLeft: 10,
    width: "60%",
    marginRight: "5%",
    borderBottomWidth: 0.5,
    borderColor: "#E0E0E0"
  },
  showCounterScroll: {
    width: "80%",
    fontSize: 20
  },
  dateContainer: {
    position: "absolute",
    top: 8,
    right: 20,
    height: 18,
    width: "60%",
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    borderRadius: 5
  },
  dateText: {
    height: "100%",
    fontSize: 13,
    fontStyle: 'italic',
    justifyContent: "center",
    color: "#00264d"
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
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    domain: state.auth.domain,
    session: state.sessions.selectSection,
    counters: state.sessions.counters,
    counter: state.sessions.counter,
    date: state.calendar.date,
    loading: state.loading.animate
  }
}

const mapDispacthToProps = (dispatch) => {
  return {
   setCounters: (counters) => dispatch(setCounters(counters)),
   selectCounter: (counter) => dispatch(selectCounter(counter)),
   ShowLoading: (animate) => dispatch(loading(animate)),
   showMessage: (action) => dispatch(showMessage(action)),
   sendMessage: (sms) => dispatch(message(sms))
  }
}

export default connect(mapStateToProps, mapDispacthToProps)(Counters)