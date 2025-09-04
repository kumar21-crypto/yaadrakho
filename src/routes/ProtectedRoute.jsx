import React from 'react'
import { useAuth } from '../auth/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if(loading) {
    return <div className="grid place-items-center h-screen">Loading…</div>;
  }

  if(!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Outlet />
  )
}

export default ProtectedRoute
