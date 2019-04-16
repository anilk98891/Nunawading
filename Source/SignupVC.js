import React from 'react';
import { Platform, StyleSheet, ImageBackground, Alert, View, Text, TextInput, AsyncStorage, Button, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import * as firebase from "firebase";
import constantsColor from '../Constants/ConstantClass'

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'example.page.link'
};

export default class SignInScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      deviceToken: '',
    }
  }

  responseHandle(response) {
    this.setState({ isLoading: false, })
    if (response.responsecode == false) {
      Alert.alert(response.MessageWhatHappen)
    } else {
      AsyncStorage.setItem('userData', JSON.stringify(response.LoginResponse));
      AsyncStorage.setItem('userToken', "true")
      this.props.navigation.navigate('Tabbar');
    }
  }

  async setUserData() {
    let user = await firebase.auth().currentUser;

    let userMobilePath = "/Users/" + user.uid;
    this.setState({ isLoading: false, })
    return firebase.database().ref(userMobilePath).set({
      password: this.state.password,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      isActive: false,
      isAdmin: false,
      deviceToken: '1233',
      deviceType: Platform.OS
    })
  }

  async _onSignupPressed() {
    if (this.state.email.length == 0 && this.state.password.length == 0 && this.state.firstName.length == 0 && this.state.lastName.length == 0) {
      Alert.alert('Enter required fields')
    } else {
      this.setState({ isLoading: true, })

      try {
        let user = await firebase.auth()
          .createUserWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password);

            this.setUserData(user.userId)
            Alert.alert(
              'App name',
              'User registered Successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.pop(),
                },
              ],
            );
      } catch (error) {
        Alert.alert(error.toString())
        this.setState({ isLoading: false, })

      }
    }
  }
  _onPrivacy = () => {

  }

  _onCheck = () => {

  }

  _onPop = () => {
    this.props.navigation.pop()
  }

  _onSIGNUPPressed() {
    this.props.navigation.navigate('SignUp');
  }

  render() {


    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <SafeAreaView>
        <ImageBackground style={{ width: '100%', height: '100%' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <TextInput style={styles.textInputPlaceholder} placeholderTextColor={constantsColor.COLOR.DARKGRAY} placeholder="email@example.com" underlineColorAndroid="transparent" onChangeText={(text) => this.state.email = text} />
              <TextInput style={styles.textInputPlaceholder} placeholderTextColor={constantsColor.COLOR.DARKGRAY} placeholder="First name" underlineColorAndroid="transparent" onChangeText={(text) => this.state.firstName = text} />
              <TextInput style={styles.textInputPlaceholder} placeholderTextColor={constantsColor.COLOR.DARKGRAY} placeholder="Last name" underlineColorAndroid="transparent" onChangeText={(text) => this.state.lastName = text} />
              <TextInput style={styles.textInputPlaceholder} placeholderTextColor={constantsColor.COLOR.DARKGRAY} placeholder="Password" underlineColorAndroid="transparent" onChangeText={(text) => this.state.password = text} />

              <View style={styles.subcontainer}>
                <TouchableOpacity onPress={() => this._onCheck()}>
                  <Image source={require('../Resources/square.png')} style={{ right: 20, width: 30, height: 30 }}></Image>
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 4 }}>Terms & Conditions</Text>
              </View>

              <TouchableOpacity style={styles.buttonStyles} onPress={() => this._onSignupPressed()}>
                <Text style={styles.titleButton}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._onPop()}>
                <Text style={{ textAlign: 'center', fontSize: 18, margin: 15 }}>Already Register? Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._onPrivacy()}>
                <Text style={{ textAlign: 'center', fontSize: 18, margin: 15 }} >Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  subcontainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  textBold: {
    marginTop: 70,
    margin: 20,
    textAlign: 'left',
    fontSize: 26,
    color: "#333333",
    fontWeight: "normal",
  },
  textTitle: {
    marginTop: 10,
    margin: 20,
    textAlign: 'left',
    fontSize: 18,
    color: "#737373",
  },
  textTitlePassword: {
    marginTop: 20,
    margin: 20,
    textAlign: 'left',
    fontSize: 18,
    color: "#737373",
  },
  textInputPlaceholder: {
    marginTop: 10,
    margin: 20,
    textAlign: 'left',
    fontSize: 18,
    borderWidth: 1,
    height: 40,
    padding: 10
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    margin: 20,
    marginTop: -4,
  },
  buttonCenter: {
    marginTop: 40,
    alignSelf: 'center',
    fontWeight: "bold",

  },
  buttonStyles: {
    alignItems: 'center',
    backgroundColor: '#F46C08',
    padding: 10,
    margin: 20,
    borderRadius: 5,

  },
  titleButton: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',

  },
  titleBelow: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#737373',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageLogo: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  }
});