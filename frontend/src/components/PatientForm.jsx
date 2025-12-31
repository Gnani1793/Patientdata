import React, {useState} from 'react'
import api from '../api'
import { motion } from 'framer-motion'

export default function PatientForm({onSaved}){
  const [form, setForm] = useState({
    name: '', age: '', gender: '', phone: '', address: '', date: '', complaint: '',
    visualAcuity: { distance: { va: '', refraction: '' }, near: { va: '', refraction: '' } },
    refraction: { right: { refraction: '' }, left: { refraction: '' } },
    slitLamp: { right: '', left: '' },
    diagnosis: '', advice: ''
  })

  const updateForm = (path, value) => {
    const keys = path.split('.')
    setForm(prev => {
      const newForm = { ...prev }
      let current = newForm
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] }
      }
      current[keys[keys.length - 1]] = value
      return newForm
    })
  }

  const submit = async e => {
    e.preventDefault()
    try {
      await api.post('/api/patients', form)
      onSaved()
      setForm({
        name: '', age: '', gender: '', phone: '', address: '', date: '', complaint: '',
        visualAcuity: { distance: { va: '', refraction: '' }, near: { va: '', refraction: '' } },
        refraction: { right: { refraction: '' }, left: { refraction: '' } },
        slitLamp: { right: '', left: '' },
        diagnosis: '', advice: ''
      })
    } catch (err) {
      alert('Error saving patient')
    }
  }

  return (
    <motion.form onSubmit={submit} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration:0.6, ease:'easeOut'}} className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-sky-50 rounded-2xl shadow-2xl border border-sky-100">
      <motion.div initial={{y:-30, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.2}} className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">New Patient Registration</h3>
        <p className="text-gray-600 mt-2">Complete eye examination record</p>
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Name</label>
          <input placeholder="Full Name" value={form.name} onChange={e=>updateForm('name', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm" required />
        </motion.div>
        <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Age</label>
          <input placeholder="Age" type="number" value={form.age} onChange={e=>updateForm('age', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm" />
        </motion.div>
        <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Gender</label>
          <select value={form.gender} onChange={e=>updateForm('gender', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </motion.div>
        <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Phone</label>
          <input placeholder="Phone Number" value={form.phone} onChange={e=>updateForm('phone', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm" />
        </motion.div>
        <motion.div className="md:col-span-2" whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Address</label>
          <textarea placeholder="Complete Address" value={form.address} onChange={e=>updateForm('address', e.target.value)} rows="3" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm resize-none" />
        </motion.div>
        <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Examination Date</label>
          <input type="date" value={form.date} onChange={e=>updateForm('date', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm" />
        </motion.div>
        <motion.div className="md:col-span-1" whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-sky-600 transition-colors">Complaint</label>
          <textarea placeholder="Patient's Complaint" value={form.complaint} onChange={e=>updateForm('complaint', e.target.value)} rows="3" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/80 backdrop-blur-sm resize-none" />
        </motion.div>
      </motion.div>

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-sky-700">Visual Acuity</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 group-focus-within:text-sky-600">Distance VA (R)</label>
            <input value={form.visualAcuity.distance.va} onChange={e=>updateForm('visualAcuity.distance.va', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-white/90" />
          </motion.div>
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 group-focus-within:text-sky-600">Distance Ref (R)</label>
            <input value={form.visualAcuity.distance.refraction} onChange={e=>updateForm('visualAcuity.distance.refraction', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-white/90" />
          </motion.div>
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 group-focus-within:text-sky-600">Near VA (L)</label>
            <input value={form.visualAcuity.near.va} onChange={e=>updateForm('visualAcuity.near.va', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-white/90" />
          </motion.div>
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 group-focus-within:text-sky-600">Near Ref (L)</label>
            <input value={form.visualAcuity.near.refraction} onChange={e=>updateForm('visualAcuity.near.refraction', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-white/90" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.5}} className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-2xl border border-teal-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-teal-700">Refraction</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-teal-600">Right Eye</label>
            <input value={form.refraction.right.refraction} onChange={e=>updateForm('refraction.right.refraction', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all bg-white/90" />
          </motion.div>
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-teal-600">Left Eye</label>
            <input value={form.refraction.left.refraction} onChange={e=>updateForm('refraction.left.refraction', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all bg-white/90" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.6}} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-purple-700">Slit Lamp Examination</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-purple-600">Right Eye</label>
            <textarea value={form.slitLamp.right} onChange={e=>updateForm('slitLamp.right', e.target.value)} rows="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all bg-white/90 resize-none" />
          </motion.div>
          <motion.div whileFocus={{scale:1.05}} transition={{type:'spring', stiffness:400}} className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-purple-600">Left Eye</label>
            <textarea value={form.slitLamp.left} onChange={e=>updateForm('slitLamp.left', e.target.value)} rows="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all bg-white/90 resize-none" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.7}} className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-amber-700">Diagnosis & Advice</h4>
        </div>
        <div className="space-y-4">
          <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600">Diagnosis</label>
            <textarea placeholder="Medical Diagnosis" value={form.diagnosis} onChange={e=>updateForm('diagnosis', e.target.value)} rows="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all bg-white/90 resize-none" />
          </motion.div>
          <motion.div whileFocus={{scale:1.02}} transition={{type:'spring', stiffness:300}} className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600">Advice</label>
            <textarea placeholder="Medical Advice & Treatment Plan" value={form.advice} onChange={e=>updateForm('advice', e.target.value)} rows="4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all bg-white/90 resize-none" />
          </motion.div>
        </div>
      </motion.div>

      <motion.button type="submit" whileHover={{scale:1.05, boxShadow:'0 20px 40px rgba(0,0,0,0.1)'}} whileTap={{scale:0.95}} transition={{type:'spring', stiffness:400}} className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:from-sky-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Save Patient Record
      </motion.button>
    </motion.form>
  )
}