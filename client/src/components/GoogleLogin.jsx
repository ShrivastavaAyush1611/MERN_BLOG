import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '@/helpers/RouteName';
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
const GoogleLogin = () => {
  const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogin = async()=>{
       try {
      
            const googleResponse = await signInWithPopup(auth,provider)
            const user = googleResponse.user
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/google-login`, {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyData),
              credentials: 'include',
            })
                const data = await response.json()
               
                if(!response.ok){
                   showToast('error',data.message)
                }
                dispatch(setUser(data.user))     //dispatch is a method provided by the Redux used to send actions to the store.When the user logs in with Google, the setUser action is dispatched with the user data.
                navigate(RouteIndex)
                showToast('success',data.message)
              } catch (error) {
                showToast('error',error.message)
              }
        
    }
  return (
    <Button variant="outline" className="w-full cursor-pointer" onClick={handleLogin}>
       <FcGoogle />
        Continue With Google
    </Button>
  )
}

export default GoogleLogin



// 1=> User Logs In:
//      The user clicks the "Continue With Google" button or submits the login form.
//      The handleLogin or onSubmit function is triggered.
//2=> Dispatching an Action:
//    The setUser action is dispatched with the user's data.
//    Example:
//    dispatch(setUser({ name: 'John', email: 'john@example.com' }));
// 3=>Reducer Updates the State:
//    The userReducer processes the setUser action and updates the state:
//    state.isLoggedIn = true;
//    state.user = { name: 'John', email: 'john@example.com' };
// 4=>State is Persisted:
//    The updated state is saved in sessionStorage using redux-persist.
//5=> Components React to State Changes:
//    Any component subscribed to the Redux store (e.g., using useSelector) will re-render with the updated state.