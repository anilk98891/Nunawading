import React from 'react';
import { StyleSheet, FlatList, View, Text, Button, AsyncStorage, Image, SafeAreaView } from 'react-native';
import CustomRow from '../CustomView/MyListItem'
import YourRestApi from '../ApiClass/RestClass'
import constantClass from '../Constants/ConstantClass'

export default class DriveData extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            id: 0,
            isHidden: true,
            events: []
        };
    }   

    onPress = () =>  {
        this.setState({isHidden: true})
    }

    onPressItem = (id) => {
        console.log(id)
            this.props.navigation.navigate('WebView', {
                itemId: id,
              });
    }

    componentWillMount() {
        this._retrieveData()
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

    _retrieveData = async () => {
        console.log('enter')
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // We have data!!
                constantClass.GoogleKeys.GoogleAuthToken = value
                console.log(value)
                const api = new YourRestApi();
                api.headers.Authorization = 'OAuth ' + value
                api.getDriveData()
                    .then(response => this.responseHandle(response))   // Successfully logged in
                    .catch(err => alert(err.message));  // Catch any error
            }
        } catch (error) {
            // Error retrieving data
            console.log(error)
        }
    };

    retrieveItem() {
        this.setState({ isLoading: true, })
        
    };

    renderItem = ({ item }) => (
        <CustomRow
            id={item.id}
            start={item.createdDate}
            summary={item.title}
            onPress={this.onPressItem}
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