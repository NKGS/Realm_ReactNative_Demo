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
  TouchableHighlight
} from 'react-native';

import Realm from 'realm';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const DetailsScreen = (({ route, navigation }) => {

  const [realm, setRealm] = useState(null)
  const [note, setNotes] = useState(route.params.data)

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
    })
  }, [])

  const onChangeText = (val) => {
    setNotes({
      id: note.id,
      title: note.title,
      description: val
    })
  }

  const saveData = () => {
    let updt = realm.objects('notes');


    realm.write(() => {
      updt[route.params.index].description = note.description;
    });
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TextInput
        style={{ height: '80%', borderColor: 'gray', borderWidth: 1, width: '90%', margin: 10, color: 'black' }}
        onChangeText={text => onChangeText(text)}
        multiline
        numberOfLines={30}
        value={note.description}
      />
      <View>
        <TouchableOpacity onPress={()=> saveData()} style={{ backgroundColor: 'darkblue', minWidth: '90%', alignItems: 'center', height: 40, justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
})


export default DetailsScreen;
