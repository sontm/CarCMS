
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import SettingReducer from './SettingReducer';
import UserReducer from './UserReducer';
import TeamReducer from './TeamReducer';

const initialState = {};

//const middleware = [thunk, logger];
const middleware = [thunk];

const reducers = combineReducers({
  settingData: SettingReducer,
  userData: UserReducer,
  teamData: TeamReducer,
});

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'settingData','userData','teamData'
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    //'teamData','tempData'
  ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Redux: Store
const store = createStore(
    persistedReducer,
    applyMiddleware(...middleware),
);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {
    store,
    persistor,
};
