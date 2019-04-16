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
import videoPlayerScreen from './Source/VideoPlayer'
import SignInScreen from './Source/SignInVc'
import SignUpScreen from './Source/SignupVC'
import UserRoleScreen from './Source/UserRole'

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const AppStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      title: 'videoPlayer',
      headerTitle: 'video List',
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      title: 'videoPlayer',
      headerTitle: 'video List',
    }
  },
  Calender: {
    screen: CalenderDataScreen,
  }, 
  CalenderEvent: {
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
  UserRole: {
    screen:   UserRoleScreen,
    navigationOptions: {
      title: ' Users list',
      headerTitle: 'User List',
    }
  },
  WebView: {
    screen: WebViewDataScreen,
    navigationOptions: {
      title: 'WebView',
      headerTitle: 'WebView List',
    }
  },
  videoPlayer: {
    screen: videoPlayerScreen,
    navigationOptions: {
      title: 'videoPlayer',
      headerTitle: 'video List',
    }
  }
});

export default createAppContainer(AppStack);
