import React from 'react';
import { StyleSheet, FlatList, View, Text, TouchableHighlight, AsyncStorage, Image, SafeAreaView } from 'react-native';
import CustomRow from '../CustomView/MyListItem'
import YourRestApi from '../ApiClass/RestClass'
import ConstantClass from '../Constants/ConstantClass'
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events'
import RNLocalNotifications from 'react-native-local-notifications';

export default class CalenderEventListing extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            id: 0,
            selectedIndex: 0,
            isHidden: true,
            events: []
        };
    }

    convertDate = (data) => {
        const date = new Date(data);
        return formattedDate2 = moment(date).format("dddd DD MMMM hh:mm A")
    }

    onPress = () => {
        this.setState({ isHidden: true })
    }

    onPressItem = (id, index) => {
        this.state.selectedIndex = index
        this.setState({ isHidden: false })
    }

    componentWillMount() {
        // iOS
        RNCalendarEvents.authorizationStatus()
            .then(status => {
                // if the status was previous accepted, set the authorized status to state
                this.setState({ cal_auth: status })
                if (status === 'undetermined') {
                    // if we made it this far, we need to ask the user for access 
                    RNCalendarEvents.authorizeEventStore()
                        .then((out) => {
                            if (out == 'authorized') {
                                // set the new status to the auth state
                                this.setState({ cal_auth: out })
                                
                            }
                        })
                }
            })
            .catch(error => console.warn('Auth Error: ', error));

        // Android
        RNCalendarEvents.authorizeEventStore()
            .then((out) => {
                if (out == 'authorized') {
                    // set the new status to the auth state
                    this.setState({ cal_auth: out })
                }
            })
            .catch(error => console.warn('Auth Error: ', error));

        this.retrieveItem()
    }

    responseHandle(response) {
        console.log(response)
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            this.setState({
                events: response.items
            });

            function removeEvent(value) {
                let fromTime = moment(value.start.dateTime).add(2, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                let currentDate = moment(value.start.dateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                RNCalendarEvents.fetchAllEvents(currentDate, fromTime).then(events => {
                    for (let event of events) {
                        if (event.notes == 'church') {
                            RNCalendarEvents.removeEvent(event.id)
                            console.log('delete')
                        }
                    }
                });
            }

            for (i = 0; i < this.state.events.length; i++) {
                removeEvent(this.state.events[i])
                fetchAndDelete(this.state.events[i],i)
            }

            function fetchAndDelete(i,j) {
                var promise1 = new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(i);
                    }, 500 * j);
                });

                promise1.then(function (value) {
                        createEvents(value)
                        createLocalNotification(value)
                    })
            }

            function createLocalNotification(value) {
                let currentDate = moment(value.start.dateTime).format("YYYY-MM-DD HH:mm")

                //RNLocalNotifications.setAndroidIcons(largeIconName, largeIconType, smallIconName, smallIconType);
                RNLocalNotifications.setAndroidIcons("1.png", "mipmap", "notification_small", "drawable"); //this are the default values, this function is optional
        
                //RNLocalNotifications.createNotification(id, text, datetime, sound[, hiddendata]);
                RNLocalNotifications.createNotification(1, value.summary, currentDate, 'default');
        
                //RNLocalNotifications.updateNotification(id, text, datetime, sound[, hiddendata]);
                // RNLocalNotifications.updateNotification(1, 'Some modifications to text', '2017-01-02 12:35', 'silence');
        
                //RNLocalNotifications.deleteNotification(id);
                // RNLocalNotifications.deleteNotification(1);
            }
        }

        function createEvents(i){
            let currentDate = moment(i.start.dateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            console.log(currentDate + i.summary)
            RNCalendarEvents.saveEvent(i.summary, {
                location: 'self',
                notes: 'church',
                description: i.summary,
                startDate: currentDate,
                endDate: currentDate,
                calendar: ['Church'],
                alarm: [{
                    date: currentDate
                }],
            })
                .then(id => {
                    // we can get the event ID here if we need it
                    console.log('created')
                    console.log(id)
                })
        }
    }

    retrieveItem = async () => {
        console.log('enter')
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // We have data!!
                ConstantClass.GoogleKeys.GoogleAuthToken = value
                const api = new YourRestApi();
                // api.headers.Authorization = ''
                api.getEventsData()
                    .then(response => this.responseHandle(response))   // Successfully logged in
                    .catch(err => alert(err.message));  // Catch any error
            }
        } catch (error) {
            // Error retrieving data
            console.log(error)
        }
    };

    renderItem = ({ item, index }) => (
        <CustomRow
            id={item.id}
            start={item.start.dateTime}
            summary={item.summary}
            onPress={this.onPressItem}
            index={index}
            color= {ConstantClass.COLOR.LIGHTBLUE}
        />
    );

    render() {

        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.events}
                        renderItem={this.renderItem}
                    />
                    {/* for show or hie of the view */}
                    {
                        this.state.isHidden == false ?
                            <View style={styles.viewHide}>
                                <View style={styles.viewTop}>
                                    <Image source={require('../Resources/calendar.png')} style={{ height: 60, width: 60 }} />
                                    <Text style={[styles.description]}>{this.state.events[this.state.selectedIndex].summary}</Text>
                                    <Text style={[styles.subdescription]}>{this.convertDate(this.state.events[this.state.selectedIndex].start.dateTime)}</Text>
                                    <Text style={[styles.subdescription]}>{this.state.events[this.state.selectedIndex].description}</Text>
                                    <TouchableHighlight
                                        style={styles.submit}
                                        onPress={this.onPress}
                                        underlayColor='#fff'>
                                        <Text style={[styles.submitText]}>Close</Text>
                                    </TouchableHighlight>
                                </View>
                            </View> : null
                    }
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
    description: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    subdescription: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center'
    },

    backButton: {
        marginTop: 20,
        margin: 20,
        height: 25,
        width: 35,
        textAlign: 'left',
        resizeMode: 'stretch',
    },
    submit: {
        marginTop: 10,
        width: 80,
        height: 40
    },
    submitText: {
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        color: 'blue',
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black'
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
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewTop: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        width: 250,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black'
    },
    buttonDown: {
        bottom: 10
    }

})