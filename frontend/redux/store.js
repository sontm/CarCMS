
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import VehicleReducer from './VehicleReducer';
import SettingReducer from './SettingReducer';

const initialState = {};

const middleware = [thunk, logger];
//const middleware = [thunk];

const reducers = combineReducers({
  vehicleData: VehicleReducer,
  settingData: SettingReducer
});

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'vehicleData','settingData'
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    '',
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
