import React, { Component } from 'react'
import { View ,Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class ShowMessage extends Component {
  render() {
    if (this.props.show) {
      return (
        <View style={styles.container}>
          <Text style={styles.message} >{this.props.message}</Text>
        </View>
      )
    }
    else
      return null
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#E87A49',
    height: 40,
    left: 0, 
    bottom: 0, 
    width: "100%"
  },
  message: {
    padding: 10,
    color: "#474747",
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400'
  }
})
const mapStateToProps = (state) => {
  return {
    show: state.message.show,
    message: state.message.message
  }
}

export default connect(mapStateToProps)(ShowMessage)