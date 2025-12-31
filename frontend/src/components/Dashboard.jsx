import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import PatientList from './PatientList'
import api from '../api'
import { getToken } from '../utils/auth'
import WhatsAppConnect from './WhatsAppConnect'

export default function Dashboard() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for token on component mount
  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true })
      return
    }
  }, [navigate])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/api/patients')
      setPatients(res.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/login', { replace: true })
        return
      }
      setError('Failed to load patients. Please check if the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-indigo-700 bg-clip-text text-transparent mb-2">
              Patient Management Dashboard
            </h2>
            <p className="text-slate-600">Manage patient records and examinations efficiently</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/new-patient')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Patient
          </motion.button>
        </motion.div>

        <WhatsAppConnect />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(14,165,233,0.15)' }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="p-6 bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-xl border border-sky-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-sky-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Patients</h3>
              <p className="text-4xl font-bold text-sky-600">{patients.length}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(20,184,166,0.15)' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            className="p-6 bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-xl border border-teal-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/new-patient')}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all"
              >
                Add Patient
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(139,92,246,0.15)' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
            className="p-6 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Reports</h3>
              <p className="text-sm text-gray-600">Generate patient reports and export data</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100"
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="ml-2 text-gray-600">Loading patients...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium mb-2">Failed to load patients</p>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchPatients}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <PatientList patients={patients} onRefresh={fetchPatients} />
          )}
        </motion.div>
      </main>
    </motion.div>
  )
}