import React from 'react';
import { StyleSheet, ImageBackground, Alert, View, Text, TextInput, AsyncStorage, Button, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import * as firebase from "firebase";
import constantsColor from '../Constants/ConstantClass'

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCS5OAeqkFotYd99EBTyBPe6BibMu27j7g",
    authDomain: "calenderdemo123.firebaseapp.com",
    databaseURL: "https://calenderdemo123.firebaseio.com",
    projectId: "calenderdemo123",
    storageBucket: "calenderdemo123.appspot.com",
    messagingSenderId: "290826560562"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class SignInScreen extends React.Component {
    
    constructor() {
        super();
        this.state = {
            email:'',
            password: '',
        }
        this.itemsRef = firebaseApp.database().ref();
    }
    _onForgotPasswoordPressed() {
        console.log('clicked')
        this.props.navigation.navigate('Forgot');
    }

    responseHandle(response) {
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            console.log(response.LoginResponse);
            console.log(response.LoginResponse.first_name);
            AsyncStorage.setItem('userData', JSON.stringify(response.LoginResponse));
            AsyncStorage.setItem('userToken', "true")
            this.props.navigation.navigate('Tabbar');
        }
    }

    async _onSignInPressed() {
        if (this.state.email.length == 0 && this.state.password.length == 0) {
            Alert.alert('Enter required fields')
        }
        else {
        this.setState({ isLoading: true, })

        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);

                this.setState({
                    response: "Logged In!"
                });
                this.fetchRelatedData()

            } catch (error) {
                this.setState({ isLoading: false, })

                Alert.alert(error.toString())

            }
        }
    }

      async fetchRelatedData(){
        let user = await firebase.auth().currentUser;
        console.log(firebase.auth().currentUser.uid)

        let userMobilePath = "/Users/" + user.uid ;
        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
            this.setState({ isLoading: false, })
            console.log(snapshot.val())
            if (snapshot.val().isActive) {
                this.props.navigation.navigate('Calender');
            }else{
                Alert.alert('You are not active.')
            }
        });
      }

      _onSignUpPressed() {
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
                            <TextInput style={styles.textInputPlaceholder} placeholderTextColor= {constantsColor.COLOR.DARKGRAY} placeholder="email@example.com" underlineColorAndroid="transparent" onChangeText={(text) => this.state.email = text} />
                            <TextInput style={styles.textInputPlaceholder} placeholderTextColor={constantsColor.COLOR.DARKGRAY} placeholder="Password" underlineColorAndroid="transparent" onChangeText={(text) => this.state.password = text} />

                            <TouchableOpacity style={styles.buttonStyles} onPress={() => this._onSignInPressed()}>
                                <Text style={styles.titleButton}>Sign In</Text>
                            </TouchableOpacity>

                            <View style={styles.subcontainer}>
                                <TouchableOpacity onPress={() => this._onResetPressed()}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, margin: 15 }}>Reset password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this._onSignUpPressed()}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, margin: 15 }} >Register Account</Text>
                                </TouchableOpacity>
                            </View>
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
        padding: 10,
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