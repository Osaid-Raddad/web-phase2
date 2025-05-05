
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import SignUp from './components/auth/signUp/SignUp';
import SignIn from './components/auth/signIn/SignIn';
import UserLayout from './components/layout/UserLayout';
import Home from './components/home/Home';
import Project from './components/project/Project';
import Task from './components/task/Task';
import Chat from './components/chat/Chat';
import { ToastContainer } from 'react-toastify';
function App() {
  
  const route = createBrowserRouter([
    {
      path: "/",
      element:<AuthLayout/>
      ,
      children: [
        {
          path:"signup",
          element:<SignUp/>
        },
        {
          path:"signin",
          element:<SignIn/>
        },
        {
          index: true,
          element:<SignIn/>
        }
      ]
    },
    {
      path: "/app",
      element:<UserLayout/>
      ,
      children:[
        {
          path:"home",
          element:<Home/>
        },
        {
          path:"projects",
          element:<Project/>
        },
        {
          path:"tasks",
          element:<Task/>
        },
        {
          path:"chat",
          element:<Chat/>
        },
        {
          index: true,
          element:<Home/>
        }
      ]
    },
  ])

  return (
    <>
      
      <ToastContainer />
      <RouterProvider router={route}/>
    </>
  )
}

export default App
