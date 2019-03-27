import React, {Component} from 'react';
import {WebView} from 'react-native';
import constantclass from '../Constants/ConstantClass'

export default class MyWeb extends React.PureComponent {
     
  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId');
    console.log("https://www.googleapis.com/drive/v3/files/"+ itemId + "?alt=media" + "&access_token=" + constantclass.GoogleKeys.GoogleAuthToken)
    return (
      <WebView
        source={{uri: "https://www.googleapis.com/drive/v3/files/"+ itemId + "?alt=media" + "&access_token=" + constantclass.GoogleKeys.GoogleAuthToken}}
        style={{marginTop: 20,width:'100%'}}
      />
    );
  }
}