import React from 'react';
import PlacesNavigator from './navigation/PlacesNavigator';

import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import placesReducer from './store/places-reducers';
import { init } from './helpers/db';

init()
.then(() => {
  console.log('Db is initialized');
}).catch((err) => {
  console.log('DB INITIALIZING ERROR');
  console.log(err);
});

const rootReducer = combineReducers({
  places: placesReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return <Provider store={store}><PlacesNavigator /></Provider>;
}
