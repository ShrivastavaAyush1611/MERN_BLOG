import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn :false,
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      setUser : (state,action)=>{
         const payload = action.payload
         state.isLoggedIn=true;
         state.user = payload           // Updates the user state
      },
      removeUser:(state,action)=>{
        state.isLoggedIn=false
        state.user={}
      }

    },
})
export const {setUser,removeUser}= userSlice.actions
export default  userSlice.reducer  

//userReducer processes the setUser action and updates the state
