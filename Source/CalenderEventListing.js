import React from 'react';
import { StyleSheet, FlatList, View, Text, TouchableHighlight, AsyncStorage, Image, SafeAreaView } from 'react-native';
import CustomRow from '../CustomView/MyListItem'
import YourRestApi from '../ApiClass/RestClass'
import ConstantClass from '../Constants/ConstantClass'
import moment from 'moment';

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
        console.log('tapp')
        this.setState({ isHidden: true })
    }

    onPressItem = (id, index) => {
        this.state.selectedIndex = index
        this.setState({ isHidden: false })
    }

    componentWillMount() {
        this.retrieveItem()
    }

    responseHandle(response) {
        console.log(response);
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            this.setState({
                events: response.items
            });
        }
    }

    retrieveItem = async () => {
        console.log('enter')
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // We have data!!
                ConstantClass.GoogleKeys.GoogleAuthToken = value
                console.log(value)
                const api = new YourRestApi();
                api.headers.Authorization = 'OAuth ' + value
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