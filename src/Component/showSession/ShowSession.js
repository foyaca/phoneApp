import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import {connect} from 'react-redux'

class ShowClient extends Component {

  onPressSession = () => {
    Alert.alert(
      'Sorry!!!',
      'You cannot manage this session',
      [
        {text: 'OK', onPress: () => null}
      ],
      { cancelable: false }
    )
  }

  render() {
    if (this.props.user.id === this.props.session.user.id || ( this.props.user.role !== undefined && this.props.user.role[0] === "admin")){
      return (
        <TouchableOpacity onPress={this.props.onSessionPressed}>
          <View style={styles.container}>
            <View style={styles.listItem}>
              <View style={styles.userName}>
                <Text style={styles.clientBox}>{this.props.session.user.name.split(" ").slice(0,2).join(" ")}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Icon name="person" size={80} color="#00264d" style={styles.icon}/>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.header}>Added Session</Text>
              <Text style={styles.pos}>POS: {this.props.session.instance.place_of_service}</Text>
              <Text style={styles.time}>Start Time: {moment(this.props.session.instance.start_time).utc().format("h:mm A")}</Text>
              <Text style={styles.time}>End Time: {moment(this.props.session.instance.end_time).utc().format("h:mm A")}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    else {
      return(
        <TouchableOpacity onPress={this.onPressSession}>
          <View style={styles.container}>
            <View style={styles.listItem}>
              <View style={styles.userName}>
                <Text style={styles.clientBox}>{this.props.session.user.name.split(" ").slice(0,2).join(" ")}</Text>
              </View>
              <View style={styles.iconContainer}> 
                <Icon name="person" size={80} color="#00264d" style={styles.icon}/>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.header}>Added Session</Text>
              <Text style={styles.pos}>POS: {this.props.session.instance.place_of_service}</Text>
              <Text style={styles.time}>Start Time: {moment(this.props.session.instance.start_time).utc().format("hh:mm A")}</Text>
              <Text style={styles.time}>End Time: {moment(this.props.session.instance.end_time).utc().format("hh:mm A")}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) 
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: "2%",
    borderWidth: 0.3,
    height: 120,
    width: "96%",
    borderRadius: 4,
    padding: "2%"
    
  },
  listItem: {
    flexDirection: "column",
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf2f9"
    
  },
  userName: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  clientBox: {
    fontSize: 15,
    color: "#00264d"
  },
  icon: {
    justifyContent: "center", 
    width: "15%"
  },
  info: {
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "100%",
    padding: 20
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00264d"
  },
  pos: {
    fontSize: 16,
    color: "#00264d"
  },
  time: {
    fontSize: 14,
    color: "#00264d"
  }

})

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(ShowClient)