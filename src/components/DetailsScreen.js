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
  FlatList, 
  SafeAreaView
} from 'react-native';

import Realm from 'realm';

const DetailsScreen = (({route, navigation}) => {

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
      alert('Notes saved successfully');
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

  return (
    <View style={{ flex: 1, alignItems: 'center', borderWidth: 1, borderColor: 'red' }}>
      <Text>{route.params.data.description}</Text>    
    </View>
  );
})


export default DetailsScreen;
