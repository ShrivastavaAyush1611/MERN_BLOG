import { useState } from 'react'
import './App.css'
import Layout from './Layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RouteIndex, RouteSignUp,RouteSignIn, RouteProfile, RouteAddCategory, RouteCategoryDetails, RouteEditCategory, RouteBlog, RouteBlogAdd, RouteBlogEdit, RouteBlogDetails, RouteBlogByCategory, RouteSearch,RouteCommentDetails, RouteUser } from './helpers/RouteName'
import Index from './pages/Index'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AddCategory from './pages/Category/AddCategory'
import CategoryDetails from './pages/Category/CategoryDetails'
import EditCategory from './pages/Category/EditCategory'
import BlogDetails from './pages/Blog/BlogDetails'
import AddBlog from './pages/Blog/AddBlog'
import EditBlog from './pages/Blog/EditBlog'
import SingleBlogDetails from './pages/SingleBlogDetails'
import BlogByCategory from './pages/Blog/BlogByCategory'
import SearchResult from './pages/SearchResult'
import Comments from './pages/Comments'
import User from './pages/User'
import AuthProtection from './components/AuthProtection'
import OnlyAdminsAllowed from './components/OnlyAdminsAllowed'

function App() {
  const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
           <Route index element={<Index/>}/>
          
          
          <Route path={RouteBlogDetails()} element={<SingleBlogDetails/>}/>
          <Route path={RouteBlogByCategory()} element={<BlogByCategory/>}/>
          <Route path={RouteSearch()} element={<SearchResult />} />
          
         

          
        <Route element={<AuthProtection/>} >
           <Route path={RouteProfile} element={<Profile/>}/>
           <Route path={RouteBlog} element={<BlogDetails/>}/>
           <Route path={RouteBlogAdd} element={<AddBlog/>}/>
           <Route path={RouteBlogEdit()} element={<EditBlog/>}/>
           <Route path={RouteCommentDetails} element={<Comments />} />
        </Route>


        <Route element={<OnlyAdminsAllowed/>}>
          <Route path={RouteUser} element={<User />} />
          <Route path={RouteAddCategory} element={<AddCategory/>}/>
          <Route path={RouteCategoryDetails} element={<CategoryDetails/>}/>
          <Route path={RouteEditCategory()} element={<EditCategory/>}/>
        </Route>   

       </Route>
        <Route path={RouteSignIn} element={<SignIn />} />
        <Route path={RouteSignUp} element={<SignUp />}/>
      </Routes>
     </BrowserRouter>
  )
}

export default App
