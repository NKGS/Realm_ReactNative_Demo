/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  FlatList
} from 'react-native';

import Realm from 'realm';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/core';

const HomeScreen = (({navigation}) => {

  const [realm, setRealm] = useState(null)
  const [notes, setNotes] = useState(null)

  const notesSchema = {
    name: 'notes',
    properties: {
      id: { type: 'int', default: 0 },
      title: 'string',
      description: 'string'
    },
  }
  //api call
  useEffect(() => {

    Realm.open({
      path: 'NotesDatabase.realm',
      schema: [notesSchema],
    }).then(realm => {
      setRealm(realm)
      var notes = realm.objects('notes');
      console.log(notes)
      setNotes(notes)
    })

  }, [])


  const addNotes = () => {
    realm.write(() => {
      var ID = realm.objects('notes').sorted('id', true).length > 0
        ? realm.objects('notes').sorted('id', true)[0]
          .id + 1
        : 1;

      realm.create('notes', {
        id: ID,
        title: 'Note ' + ID,
        description: 'Welcome to my note number ' + ID
      });
      var notes = realm.objects('notes');
      setNotes(notes)
      setRealm(realm)
    })
    // })
  }

  const ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: '#000' }} />
    );
  };

  const gotoDetailsScreen = (item, index) => {
    navigation.push('Details', { data: item, index: index })
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* <View style={{ width:'100%', alignItems: 'center', borderWidth: 1, borderColor: 'red' }}> */}
        <TouchableOpacity onPress={() => addNotes()} style={{ backgroundColor: '#dbbbbb', padding: 10 }}>
          <Text style={{ color:'blue' }}>Add Note</Text>
        </TouchableOpacity>
      {/* </View> */}

      <View style={{ flex: 1, width:'100%' }}>
        <FlatList
          ItemSeparatorComponent={ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          data={notes}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => gotoDetailsScreen(item, index)} style={{ backgroundColor: 'white', padding: 20, flex: 1 }}>
              <Text>Title: {item.title}</Text>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    </View>
  );
});


export default HomeScreen;
