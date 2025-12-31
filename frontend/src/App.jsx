import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NewPatient from './components/NewPatient'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/new-patient" element={
        <PrivateRoute>
          <NewPatient />
        </PrivateRoute>
      } />
      <Route path="/edit/:id" element={
        <PrivateRoute>
          <NewPatient />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}