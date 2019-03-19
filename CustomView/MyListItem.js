import React from 'react';
import { View, Text, StyleSheet, Image, SearchBar, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default class MyListItem extends React.PureComponent {
    constructor() {
        super();    
        this.state = {
            formattedDate : moment,
            formattedDate2 : moment
        };
    }
    onPress = () => {
        console.log('clicked clicked')
        this.props.onPress(this.props.id, this.props.index);
      };
    
      render() {
        const date = new Date(this.props.start);
        formattedDate = moment(date).format("DD MMM"),
        formattedDate2 = moment(date).format("dddd hh:mm A")

        return (
            <TouchableOpacity onPress={this.onPress}>
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <View style={styles.container_text}>
                            <Text style={styles.title}>
                                {formattedDate}
                            </Text>
                        </View>
                        <View style={styles.container_row}>
                            <Text style={styles.dayTime}>
                                {formattedDate2}
                            </Text>
                            <Text style={styles.description}>
                                {this.props.summary}
                            </Text>
                        </View>
                        <Image style={styles.photo} source={require('../Resources/arrow.png')} />
                    </View>
                </View>
            </TouchableOpacity>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        height:100,
    },

    container2: {
        padding:-21,
        flex: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        borderWidth : 1,
        borderColor: 'gray',
        elevation: 2,
        flexDirection: 'row',
    },
    title: {
        padding: 10,
        fontSize: 25,
        color: 'white',
        fontWeight:'bold',
        textAlign:'center'
    },
    description: {
        padding: 10,
        fontSize: 25,
        height:40,
        fontWeight:'bold',
        textAlign:'left'
    },
    container_text: {
        left:5,
        width: 80,
        backgroundColor: 'rgba(108,158,249,1)',
        borderRadius:40,
        height : 80
    },
    container_row: {
        flex: 1,
        left:5,
        flexDirection: 'column',
    },
    dayTime: {
        padding: 5,
        fontSize: 18
    },
    photo: {
        width: 30,
        height: 40,
        resizeMode: 'center'
    },
});