import React from 'react';
import { StyleSheet,Platform, SectionList, View, Text, TouchableHighlight, AsyncStorage, Image, SafeAreaView } from 'react-native';
import CustomRow from '../CustomView/MyListItem'
import YourRestApi from '../ApiClass/RestClass'
import ConstantClass from '../Constants/ConstantClass';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events'
// import RNLocalNotifications from 'react-native-local-notifications';

export default class TaskLisiting extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            id: 0,
            selectedIndex: 0,
            selectedSection: {},
            alertShow: true,
            isHidden: true,
            tasks: [],
            count: 0,
            grant_type : 'refresh_token',
            client_id : '290826560562-6iflh5ena0avsg2rd9sjvbv36t3vqes1.apps.googleusercontent.com',
            client_secret : '4Xb90bIWLenMxG5yXg2B8UPL',
            refresh_token : '1/0jCcycrB4U3l879PSbQEf59hLOznbHt8jRvoMF_Q4Fs'

        };
    }

    convertDate = (data) => {
        const date = new Date(data);
        return formattedDate2 = moment(date).format("dddd DD MMMM hh:mm A")
    }

    onPress = () => {
        this.setState({ alertShow: true })
    }

    onPressItem = (id, index) => {
        this.state.selectedSection = id
        this.state.selectedIndex = index
        this.setState({ alertShow: false })
    }

    componentWillMount() {
       this.authLogin()

    }

    authLogin(){
        this.setState({ isLoading: true, })
        const api = new YourRestApi();
         api.getAuthOfflineToken(this.state.grant_type, this.state.client_id,this.state.client_secret,this.state.refresh_token)
            .then(response => this.responseHandleGoogleOfflineTOken(response))   // Successfully logged in
            .catch(err => alert(err.message));  // Catch any error
    }

    responsehandleSubTask(response, index) {
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            const tempArr = this.state.tasks
            tempArr[index].data = response.items == undefined ? [{ 'title': 'No task found' }] : response.items
            this.state.count += 1
            this.state.tasks = tempArr
        }
        if (this.state.count == this.state.tasks.length) {
            this.setState({ isHidden: false })
            this.dataSetup()
        }
    }

    //get and set
    dataSetup() {

        function removeEvent(i) {
            let fromTime = moment(i.due == undefined ? i.updated : i.due).add(2, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            let currentDate = moment(i.due == undefined ? i.updated : i.due).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            RNCalendarEvents.fetchAllEvents(currentDate, fromTime).then(events => {
                for (let event of events) {
                    if (event.notes == 'church task') {
                        RNCalendarEvents.removeEvent(event.id)
                        console.log('delete')
                    }
                }
            });
        }

        for (i = 0; i < this.state.tasks.length; i++) {
            console.log('count task : ' + i)
            const subtask = this.state.tasks[i].data
            for (j = 0; j < subtask.length; j++) {
                removeEvent(subtask[j])
                fetchAndDelete(subtask[j], j)
            }
        }

        function fetchAndDelete(i, j) {
            var promise1 = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(i);
                }, 100 * j);
            });

            promise1.then(function (value) {
                createEvents(value)
                // createLocalNotification(value)
            })
        }

        function createEvents(i) {
            let currentDate = ''
            if (Platform.OS !== 'android') {
                currentDate =  moment(i.due == undefined ? i.updated : i.due).utc().format("YYYY-MM-DTHH:mm:ss.SSS") + "UTC"
            } else {
                currentDate = moment(i.due == undefined ? i.updated : i.due).utc().format("YYYY-MM-DTHH:mm:ss.SSS") + 'Z'
            }
            RNCalendarEvents.saveEvent(i.title, {
                location: 'self',
                notes: 'church task',
                description: i.notes,
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

    responseHandleGoogleOfflineTOken = async(response) =>{
        let token = response.access_token
        await AsyncStorage.setItem('token', token);
        this.retrieveItem()
    }

    responseHandle = async(response) => {
        console.log(response)
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            this.setState({
                tasks: response.items
            });
        }

        //retrieve subtask
        this.setState({ isLoading: true, })
        const api = new YourRestApi();
        api.headers.Authorization = 'OAuth ' + await AsyncStorage.getItem('token')
        const tasklists = this.state.tasks.length
        for (let i = 0; i < tasklists; i++) {
            api.state.taskId = this.state.tasks[i].id
            api.getSubTasksData()
                .then(response => this.responsehandleSubTask(response, i))   // Successfully 
                .catch(err => alert(err.message));  // Catch any error
        }

    }

    retrieveItem = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // We have data!!
                ConstantClass.GoogleKeys.authLoginToken = value
                const api = new YourRestApi();
                api.headers.Authorization = 'OAuth ' + value
                api.getTasksData()
                    .then(response => this.responseHandle(response))   // Successfully logged in
                    .catch(err => alert(err.message));  // Catch any error
            }
        } catch (error) {
            // Error retrieving data
            console.log(error)
        }
    }

    renderItem = ({ item, index, section }) => (
        <CustomRow
            id={section}
            start={item.due == undefined ? item.updated : item.due}
            summary={item.title}
            onPress={this.onPressItem}
            index={index}
            color={ConstantClass.COLOR.ORANGE}
        />
    );

    _renderSectionHeader = ({ section }) => {
        return (
            <View style={{ backgroundColor: ConstantClass.COLOR.ORANGE, height: 50, width: "100%" }} >
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', height: '100%', color: 'white', justifyContent: 'center', top: 17 }}> {section.title} </Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    {
                        this.state.isHidden == false ?
                            <SectionList
                                sections={this.state.tasks}
                                renderItem={this.renderItem}
                                renderSectionHeader={this._renderSectionHeader}
                            /> : null
                    }
                    {/* for show or hie of the view */}
                    {
                        this.state.alertShow == false ?
                            <View style={styles.viewHide}>
                                <View style={styles.viewTop}>
                                    <Image source={require('../Resources/calendar.png')} style={{ height: 60, width: 60 }} />
                                    <Text style={[styles.description]}>{this.state.selectedSection.data[this.state.selectedIndex].title}</Text>
                                    <Text style={[styles.subdescription]}>{this.state.selectedSection.data[this.state.selectedIndex].due == undefined ? this.convertDate(this.state.selectedSection.data[this.state.selectedIndex].updated) : this.convertDate(this.state.selectedSection.data[this.state.selectedIndex].due)}</Text>
                                    <Text style={[styles.subdescription]}>{this.state.selectedSection.data[this.state.selectedIndex].notes}</Text>
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