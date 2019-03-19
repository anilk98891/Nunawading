/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, Button, Text, View} from 'react-native';
import CalenderDataScreen from './Source/CalenderDataVC'
import CalenderEventScreen from './Source/CalenderEventListing'
import TaskEventScreen from './Source/TaskLisiting'
import DriveDataScreen from './Source/DriveData'
import WebViewDataScreen from './Source/WebView'

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const AppStack = createStackNavigator({
  Calender: {
    screen: CalenderDataScreen,
  }, CalenderEvent: {
    screen: CalenderEventScreen,
    navigationOptions: {
      title: `Calender`,
      headerTitle: 'Calender List',
    }
  }, TaskEvent: {
    screen: TaskEventScreen,
    navigationOptions: {
      title: `Calender`,
      headerTitle: 'Task List',
    }
  },
  DriveData: {
    screen: DriveDataScreen,
    navigationOptions: {
      title: 'Drive data',
      headerTitle: 'Drive List',
    }
  },
  WebView: {
    screen: WebViewDataScreen,
    navigationOptions: {
      title: 'WebView',
      headerTitle: 'WebView List',
    }
  }
});

export default createAppContainer(AppStack);