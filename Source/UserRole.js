import React from 'react';
import { Platform, StyleSheet, FlatList, View, Text, Button, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import AcceptView from '../CustomView/AcceptView'
import * as firebase from "firebase";

export default class UserRole extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            id: 0,
            isHidden: true,
            events: [],
            keys: []
        };
    }

    async setUserData(index) {
        this.setState({ isLoading: true, })
        let userMobilePath = "/Users/" + this.state.keys[index];
        return firebase.database().ref(userMobilePath).set({
            isActive: true,
            password: this.state.events[index].password,
            email: this.state.events[index].email,
            firstName: this.state.events[index].firstName,
            lastName: this.state.events[index].lastName,
            isAdmin: this.state.events[index].isAdmin,
            deviceToken: this.state.events[index].deviceToken,
            deviceType: Platform.OS
        })
    }

    onPressAccept = (index) => {
        this.setUserData(index)
        this.setState({ isLoading: false, })

    }

    onPressDecline = (index) => {
        console.log('decline')

    }

    responseHandle(response) {

    }

    _retrieveData = async () => {

    };

    retrieveItem() {
        this.setState({ isLoading: true, })

    };

    renderItem = ({ item, index }) => (
        <AcceptView
            id={item.id}
            summary={item.email}
            onPressAccept={this.onPressAccept}
            onPressDecline={this.onPressDecline}
            index={index}
        />
    );

    async fetchuserList(){
        this.setState({ isLoading: true, })
        let object = []

        let userMobilePath = "/Users/";

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
            console.log(snapshot.val())
            let user = firebase.auth().currentUser;
            console.log(user.uid)
            Object.entries(snapshot.val()).forEach(([key, value]) => {
                if (user.uid != key) {
                    this.state.keys.push(key)
                    object.push(value)
                }
            });

            this.setState({
                events: object
            })
            this.setState({ isLoading: false, })

        });
    }

     componentWillMount() {
        this.fetchuserList()    
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
                <View style={styles.container}>
                    <FlatList
                        data={this.state.events}
                        renderItem={this.renderItem}
                    />
                </View>
            </SafeAreaView>

        );
    }
}
var styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    backButton: {
        marginTop: 20,
        margin: 20,
        height: 25,
        width: 35,
        textAlign: 'left',
        resizeMode: 'stretch',
    },
    viewHide: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)'

    },
    viewTop: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        height: 300,
        width: 250,
        top: 130,
        bottom: 0,
        left: 0,
        right: 0,
    },
    buttonDown: {
        bottom: 10
    }

})