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

import Realm from 'realm';

const App: () => React$Node = () => {

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
      console.log('ID - ', ID);
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
    <SafeAreaView style={{ flex: 1, padding:0, margin:0, alignItems: 'center', borderWidth: 1, borderColor: 'yellow' }}>
      <View style={{ flex: 1, alignItems: 'center', borderWidth: 1, borderColor: 'red' }}>
        <TouchableHighlight onPress={() => addNotes()} style={{ backgroundColor: '#dbbbbb', width: 80, padding: 10 }}>
          <Text style={{ color: 'red' }}>Add Note</Text>
        </TouchableHighlight>

        <FlatList
          ItemSeparatorComponent={ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          data={notes}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: 'white', padding: 20, flex: 1 }}>
              <Text>Title: {item.title}</Text>
              <Text>Description: {item.description}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#efefef',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#dadada',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: '#dadada',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
