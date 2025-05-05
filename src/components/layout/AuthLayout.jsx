import React from 'react'
import SignIn from '../auth/signIn/SignIn'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div>  
      <Outlet/>
    </div>
  )
}
