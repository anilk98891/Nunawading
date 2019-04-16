import React from 'react';
import { View, Text, StyleSheet, Image, SearchBar, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default class AcceptView extends React.PureComponent {
    constructor() {
        super();    
        this.state = {
            formattedDate : moment,
            formattedDate2 : moment,
        };
    }
    onPressAccept = () => {
        this.props.onPressAccept(this.props.index);
      };

      onPressDecline = () => {
        this.props.onPressDecline(this.props.index);
      };
    
      render() {
          return (
              <View style={styles.container}>
                  <View style={styles.container2}>
                    <View style={styles.container_row}>
                        <Text style={styles.description}>
                            {this.props.summary}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.onPressAccept()}>
                        <Image style={styles.imageLogo} source={require('../Resources/check.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressDecline()}>
                        <Image style={styles.imageLogo} source={require('../Resources/del.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        height:70,
        top: 10
    },
    imageLogo: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
      },
    container2: {
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
        fontSize: 20,
        height:45,
        right:4,
        fontWeight:'600',
        textAlign:'left'
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
        right:2,
        width: 18,
        height: 15,
        resizeMode: 'center'
    },
});