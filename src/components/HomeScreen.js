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
import SwipeListData from './SwipeListData';
import database from '@react-native-firebase/database';
import { notesSchema } from '../util/Constants';

const HomeScreen = (({ navigation }) => {

  const [realm, setRealm] = useState(null)
  const [notes, setNotes] = useState(null)

  //api call
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    Realm.open({
      path: 'NotesDatabase.realm',
      schema: [notesSchema],
      signal: signal
    }).then(realm => {
      setRealm(realm)
      var notes = realm.objects('notes');
      let notesVal = [...notes]
      let notesVa = notes.map((val, index) => {
        notesVal[index].key = String(index)
      });
      setNotes(notesVal)
    })


    const onValueChange = database()
      .ref(`/notes/abc`)
      .on('value', snapshot => {
        //console.log('Snapshot data onValueChange: ', snapshot.val());
      });

    return function cleanup() {
      abortController.abort();
      database()
        .ref(`/notes/abc`)
        .off('value', onValueChange);
    }
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
      let notesVal = [...notes]
      let data = []
      let notesVa = notes.map((val, index) => {
        notesVal[index].key = String(index)
        data.push(val)
      });
      
      // database()
      //   .ref('/notes/abc')
      //   .set({data})
      //   .then(() => console.log('Data set saveddd.'));
      setNotes(notesVal)
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

  const deleteRow = (item) => {

    var ID = item.id;
    realm.write(() => {
      if (realm.objects('notes').filtered('id =' + ID).length > 0) {
        realm.delete(realm.objects('notes').filtered('id =' + ID));
        var notes = realm.objects('notes');
        let notesVal = [...notes]
        let notesVa = notes.map((val, index) => {
          notesVal[index].key = String(index)
        });
        setNotes(notesVal)
      }
    });

  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* <View style={{ width:'100%', alignItems: 'center', borderWidth: 1, borderColor: 'red' }}> */}
      <TouchableOpacity onPress={() => addNotes()} style={{ backgroundColor: '#dbbbbb', padding: 10 }}>
        <Text style={{ color: 'blue' }}>Add Note</Text>
      </TouchableOpacity>
      {/* </View> */}

      <View style={{ flex: 1, width: '100%' }}>
        {/* <FlatList
          ItemSeparatorComponent={ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          data={notes}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => gotoDetailsScreen(item, index)} style={{ backgroundColor: 'white', padding: 20, flex: 1 }}>
              <Text>Title: {item.title}</Text>
            </TouchableWithoutFeedback>
          )}
        /> */}

        <SwipeListData data={notes} deleteRowF={deleteRow} onRowClick={gotoDetailsScreen} />
      </View>
    </View>
  );
});


export default HomeScreen;
