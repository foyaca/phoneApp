import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'

const mainTabs = () => {
  Promise.all([
    Icon.getImageSource("date-range", 30),
    Icon.getImageSource("receipt", 30),
    Icon.getImageSource("settings", 30)
  ]).then(source => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: 'abalogger.CalendarScreen',
          label: 'Calendar',
          title: 'Calendar',
          icon: source[0],
          navigatorStyle: {
            navBarBackgroundColor: '#4080bf',
            navBarTextColor: 'white'
          }
        },
        {
          screen: 'abalogger.ClientReportScreen',
          label: 'Client Report',
          title: 'Client Report',
          icon: source[1],
          navigatorStyle: { 
            navBarBackgroundColor: '#4080bf',
            navBarTextColor: 'white'
          }
        }, 
        {
          screen: 'abalogger.SettingScreen',
          label: 'Settings',
          title: 'Settings',
          icon: source[2],
          navigatorStyle: { 
            navBarBackgroundColor: '#4080bf',
            navBarTextColor: 'white'
          }
        } 
      ],
      tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
        tabBarButtonColor: '#00264d', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
        tabBarSelectedButtonColor: '#ffffff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
        tabBarBackgroundColor: '#4080bf' // optional, change the background color of the tab bar
      },
      appStyle: {
        tabBarButtonColor: '#00264d', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
        tabBarSelectedButtonColor: '#ffffff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
        tabBarBackgroundColor: '#4080bf' // optional, change the background color of the tab bar
      }
    })
  })
}

export default mainTabs