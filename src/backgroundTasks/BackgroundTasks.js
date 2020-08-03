import React, { useEffect } from 'react'
import BackgroundFetch from 'react-native-background-fetch'
import database from '@react-native-firebase/database';
import Realm from 'realm';
import { notesSchema } from '../util/Constants';

export const BackgroundTasks = (props) => {

  useEffect(() => {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
    }, async (taskId) => {

      console.log("RNBackgroundFetch Received background-fetch event: " + taskId);

      /* process background tasks */

      Realm.open({
        path: 'NotesDatabase.realm',
        schema: [notesSchema]
      }).then(realm => {
      var notes = realm.objects('notes');
      let data = []
      let notesVa = notes.map((val, index) => {
        data.push(val)
      });
        database()
          .ref('/notes/abc')
          .set({ data })
          .then(() => console.log('RNBackgroundFetch Data set saveddd background task.'));
      })

      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("RNBackgroundFetch failed to start - ",error);
    });

    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("RNBackgroundFetch BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("RNBackgroundFetch BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("RNBackgroundFetch BackgroundFetch is enabled");
          break;
      }
    });

  }, []);
  return (<>
    {props.children}
  </>);
}