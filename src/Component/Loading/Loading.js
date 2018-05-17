import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable'
import { connect } from 'react-redux'

class Loading extends Component {
  render() {
    if (this.props.animate) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <Animatable.Text animation="rotate" easing="linear" direction="reverse" iterationCount="infinite" style={{ textAlign: 'center' }}>
            <Icon size={100} name="loop" color="#004d99"/>
          </Animatable.Text>
        </View>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: 'center',
    backgroundColor: '#00c0ff20',
    width: "100%",
    height: "100%"
  }
})

const mapStateToProps = (state) => {
  return {
    animate: state.loading.animate
  }
}

export default connect(mapStateToProps)(Loading)