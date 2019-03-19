import React from 'react';
import { StyleSheet, SectionList, View, Text, TouchableHighlight, AsyncStorage, Image, SafeAreaView } from 'react-native';
import CustomRow from '../CustomView/MyListItem'
import YourRestApi from '../ApiClass/RestClass'
import ConstantClass from '../Constants/ConstantClass';
import moment from 'moment';

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
            count: 0
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
        console.log(index)
        console.log(id)
        this.state.selectedSection = id
        this.state.selectedIndex = index
        console.log(this.state.selectedSection.data[this.state.selectedIndex].title)
        this.setState({ alertShow: false })
    }

    componentWillMount() {
        this.retrieveItem()

    }

    responsehandleSubTask(response, index) {
        this.setState({ isLoading: false, })
        if (response.responsecode == false) {
            Alert.alert(response.MessageWhatHappen)
        } else {
            const tempArr = this.state.tasks
            tempArr[index].data = response.items == undefined ? [{'title': 'No task found'}] : response.items
            this.state.count += 1
            this.state.tasks = tempArr
        }
        if(this.state.count == this.state.tasks.length){
        this.setState({ isHidden: false })
        }
    }

    responseHandle(response) {
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
                ConstantClass.GoogleKeys.GoogleAuthToken = value
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
        />
    );

    _renderItem = ({ item, index, section }) => (<Text>{`${item.title}(${section.title})`}</Text>)

    _renderSectionHeader = ({ section }) => {
        return (
            <View style={{ backgroundColor: ConstantClass.COLOR.ORANGE, height: 50, left: 10, width: "94%" }} >
                <Text style={{ fontSize: 16,fontWeight: 'bold',textAlign: 'left', height: '100%',color: 'white', justifyContent: 'center', top: 20 }}> {section.title} </Text>
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