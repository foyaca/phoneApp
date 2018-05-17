import React, { Component } from 'react'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

class ShowCalendar extends Component {

  render() {
    const today = moment().format("YYYY-MM-DD")
    let dates = {}
    dates[today] = { selected: true, selectedColor: '#4080bf' }
    return (
      <Calendar
        current={today}
        onDayPress={(day) => this.props.getClients(day.dateString)}
        markedDates={dates}
        style={{
          flex: 1,
          paddingTop: 30
        }}
        theme={{
          todayTextColor: '#00264d',
          arrowColor: '#4080bf',
          monthTextColor: '#4080bf',
          textDayFontSize: 18,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 18
        }}
      />
    )
  }
}

export default ShowCalendar