import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/user/user.slice'
import sessionStorage from 'redux-persist/es/storage/session'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({
  user:userReducer
})

const persistConfig = {
  key: 'root',
  storage : sessionStorage,  //session storage is used when user close the tab or browser state will be clear
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer:  persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)