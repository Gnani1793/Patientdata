import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { setToken } from '../utils/auth'
import { motion } from 'framer-motion'

export default function Login(){
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('')
    try{
      const res = await api.post('/api/auth/login', { username, password })
      setToken(res.data.token)
      navigate('/', { replace: true })
    }catch(err){
      setError(err.response?.data?.msg || 'Login failed')
    }finally{setLoading(false)}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-teal-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      <motion.div
        initial={{opacity:0, scale:0.9, y:50}}
        animate={{opacity:1, scale:1, y:0}}
        transition={{duration:0.6, ease:'easeOut'}}
        className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
      >
        <motion.div
          initial={{opacity:0, y:-20}}
          animate={{opacity:1, y:0}}
          transition={{delay:0.3}}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-sky-700 mb-2">Sri Satya Eye Care</h1>
          <p className="text-sm text-gray-600">Professional Eye Care Management</p>
        </motion.div>
        <form onSubmit={submit} className="space-y-6">
          <motion.div
            initial={{opacity:0, x:-30}}
            animate={{opacity:1, x:0}}
            transition={{delay:0.4}}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <motion.input
              whileFocus={{scale:1.02, boxShadow:'0 0 0 3px rgba(14,165,233,0.1)'}}
              value={username}
              onChange={e=>setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </motion.div>
          <motion.div
            initial={{opacity:0, x:30}}
            animate={{opacity:1, x:0}}
            transition={{delay:0.5}}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <motion.input
                whileFocus={{scale:1.02, boxShadow:'0 0 0 3px rgba(14,165,233,0.1)'}}
                value={password}
                onChange={e=>setPassword(e.target.value)}
                type={show? 'text':'password'}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={()=>setShow(s=>!s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-600 transition-colors"
              >
                {show ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{delay:0.6}}
          >
            <motion.button
              whileHover={{scale:1.05, boxShadow:'0 10px 25px rgba(14,165,233,0.3)'}}
              whileTap={{scale:0.95}}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-sky-700 hover:to-teal-700 transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{rotate:360}}
                  transition={{duration:1, repeat:Infinity, ease:'linear'}}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : null}
              {loading ? 'Signing in...' : 'Login'}
            </motion.button>
          </motion.div>
          {error && (
            <motion.div
              initial={{opacity:0, x:-20, scale:0.9}}
              animate={{opacity:1, x:0, scale:1}}
              className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200"
            >
              {error}
            </motion.div>
          )}
        </form>
        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:0.7}}
          className="mt-6 text-center text-xs text-gray-500"
        >
          Sri Satya Eye Care and Opticals
        </motion.div>
      </motion.div>
      <motion.div
        initial={{opacity:0, scale:0}}
        animate={{opacity:1, scale:1}}
        transition={{delay:0.8, duration:0.5}}
        className="absolute top-10 left-10 w-20 h-20 bg-sky-200 rounded-full opacity-20"
      />
      <motion.div
        initial={{opacity:0, scale:0}}
        animate={{opacity:1, scale:1}}
        transition={{delay:1, duration:0.5}}
        className="absolute bottom-10 right-10 w-16 h-16 bg-teal-200 rounded-full opacity-20"
      />
    </div>
  )
}