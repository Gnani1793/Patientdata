import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logout } from '../utils/auth'

export default function Sidebar(){
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.aside
      initial={{width:80, opacity:0}}
      animate={{width:280, opacity:1}}
      transition={{duration:0.5, ease:'easeOut'}}
      className="bg-gradient-to-b from-sky-700 to-teal-700 text-white shadow-2xl"
    >
      <div className="p-6">
        <motion.div
          initial={{opacity:0, y:-20}}
          animate={{opacity:1, y:0}}
          transition={{delay:0.2}}
          className="mb-8"
        >
          <h3 className="text-xl font-bold mb-1">Sri Satya Eye Care</h3>
          <div className="text-sm opacity-90">Near RTC Bus Stand, Hiramandalam</div>
        </motion.div>
        <nav className="space-y-3">
          <motion.button
            whileHover={{scale:1.05, x:5}}
            whileTap={{scale:0.95}}
            onClick={() => navigate('/')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
              location.pathname === '/' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            Dashboard
          </motion.button>
          <motion.button
            whileHover={{scale:1.05, x:5}}
            whileTap={{scale:0.95}}
            onClick={() => navigate('/new-patient')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
              location.pathname === '/new-patient' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Patient
          </motion.button>
          <motion.button
            whileHover={{scale:1.05, x:5, backgroundColor:'#dc2626'}}
            whileTap={{scale:0.95}}
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </motion.button>
        </nav>
      </div>
    </motion.aside>
  )
}