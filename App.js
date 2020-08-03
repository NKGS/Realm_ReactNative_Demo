/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  FlatList
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DetailsScreen from './src/components/DetailsScreen';
import HomeScreen from './src/components/HomeScreen';
import { BackgroundTasks } from './src/backgroundTasks/BackgroundTasks';
import BackgroundFetch, { BackgroundFetchStatus } from 'react-native-background-fetch';

const Stack = createStackNavigator();

/// Execute a BackgroundFetch.scheduleTask
///
export const scheduleTask = async (name: string) => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: name,
      stopOnTerminate: false,
      enableHeadless: true,
      delay: 5000,               // milliseconds (5s)
      forceAlarmManager: true,   // more precise timing with AlarmManager vs default JobScheduler
      periodic: false            // Fire once only.
    });
  } catch (e) {
    console.warn('[BackgroundFetch] scheduleTask fail', e);
  }
}

const App: () => React$Node = () => {

    /// BackgroundFetch event-handler.
  /// All events from the plugin arrive here, including #scheduleTask events.
  ///
  const onBackgroundFetchEvent = async (taskId: string) => {
    console.log(' Event received: ', taskId);
    if (taskId === 'react-native-background-fetch') {
      // Test initiating a #scheduleTask when the periodic fetch event is received.
      try {
        console.log('[BackgroundFetch] scheduleTask succeeded');
        //await scheduleTask('com.transistorsoft.customtask');
      } catch (e) {
        console.warn('[BackgroundFetch] scheduleTask falied', e);
      }
    }
    // Required: Signal completion of your task to native code
    // If you fail to do this, the OS can terminate your app
    // or assign battery-blame for consuming too much background-time
    BackgroundFetch.finish(taskId);
  };

  /// Switch handler in top-toolbar.
  ///
  const onToggleEnabled = async (value:boolean) => {
    try {
      if (value) {
        await BackgroundFetch.start();
      } else {
        await BackgroundFetch.stop();
      }
    } catch (e) {
      console.warn(`[BackgroundFetch] ${value ? 'start' : 'stop'} falied`, e);
    }
  };

  const init = async () => {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,      // <-- minutes (15 is minimum allowed)
      // Android options
      forceAlarmManager: false,      // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,       // Default
      requiresDeviceIdle: false,     // Default
      requiresBatteryNotLow: false,  // Default
      requiresStorageNotLow: false,  // Default
    }, onBackgroundFetchEvent, (status: BackgroundFetchStatus) => {
      setDefaultStatus(statusToString(status));
      console.log('[BackgroundFetch] status', statusToString(status), status);
    });
    // Turn on the enabled switch.
    onToggleEnabled(true);
  };

  useEffect(() => {
    init();
  }, []);


  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
