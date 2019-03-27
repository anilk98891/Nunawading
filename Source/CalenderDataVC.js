import React from 'react';
import { StyleSheet, ImageBackground, View, AsyncStorage, Button, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import RNExitApp from 'react-native-exit-app';

export default class CalenderData extends React.Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Calendar List',
            headerRight: (
                <TouchableOpacity onPress={()=>{ RNExitApp.exitApp() }} style={styles.rightBarBtn}>
                    <Image source={require('../Resources/error.png')} style={styles.rightBarImage} />
                </TouchableOpacity>
            ),
        };
    };
    

  _onSIGNINPressed() {
    this.props.navigation.navigate('CalenderEvent')
  }

    _onTaskPressed = async() => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              this.setState({ userInfo });
              let token = userInfo.accessToken
              await AsyncStorage.setItem('tokenself', token);
              this.props.navigation.navigate('TaskEvent')
            } catch (error) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
              } else {
                // some other error happened
              }
              console.log(error)

            }
    }

    _onDrivePressed = async() => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ userInfo });
            let token = userInfo.accessToken
            await AsyncStorage.setItem('tokenself', token);
            this.props.navigation.navigate('DriveData')
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
            
            console.log(error)

          }
    }

    componentWillMount() {
        console.log('run')
        GoogleSignin.configure({
          scopes:["https://www.googleapis.com/auth/calendar.events.readonly","https://www.googleapis.com/auth/plus.login","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive.readonly","https://www.googleapis.com/auth/drive.metadata.readonly","https://www.googleapis.com/auth/tasks.readonly"],
          webClientId: '290826560562-3sqo093d52llo4jhkqcfokj6nc7g77o6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction290826560562-jhg5c3blkn9u9b64fg3up9ocmi6o9ghq.apps.googleusercontent.com
            // // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // androidClientId: '290826560562-3sqo093d52llo4jhkqcfokj6nc7g77o6.apps.googleusercontent.com',
            iosClientId: '290826560562-tdgvdtt0i1bfhp71egdvm7umalfb6mbo.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
          });
    }

    render() {

        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this._onSIGNINPressed()}>
                        <Image style={styles.containerHalf} source={require('../Resources/calendar.png')} />
                    </TouchableOpacity>
                    <View style={{ height: 30 }} />
                    <TouchableOpacity onPress={() => this._onTaskPressed()}>
                        <Image style={styles.containerHalf} source={require('../Resources/task.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._onDrivePressed()}>
                        <Image  style={styles.containerHalf} source={require('../Resources/task.png')} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    }, 
    containerHalf: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 100
  },rightBarImage: {
    bottom: -3,
    height: 30,
    width: 30,
}, rightBarBtn: {
    height: 35,
    width: 40,
},
})