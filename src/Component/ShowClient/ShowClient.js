import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ShowClient extends Component {

  render() {
    return (
      <TouchableOpacity onPress={this.props.onClientPressed}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Icon name="face" size={30} style={styles.icons} color="#00264d"/>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.clientBox}>{this.props.client.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    marginBottom: 0
  },
  listItem: {
    width: "83%",
    paddingLeft: 20,
    backgroundColor: "#ecf2f9",
    height: 50,
    borderColor: '#4080bf',
    justifyContent: "center",
    borderRadius: 3
  },
  clientBox: {
    fontSize: 20
  },
  icon: {
    width: "15%",
    marginRight: 5,
    backgroundColor: "#4080bf",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  }

});

export default ShowClient