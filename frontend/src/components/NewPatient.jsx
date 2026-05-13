import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { motion } from 'framer-motion'
import { getToken } from '../utils/auth'
import PrintWrapper from './PrintWrapper'

export default function NewPatient() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [printingPatient, setPrintingPatient] = useState(null)
  const printRef = React.useRef()

  // Check for token on component mount
  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true })
      return
    }
    if (id) {
      fetchPatient()
    }
  }, [navigate, id])

  const fetchPatient = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/patients/${id}`)
      // Ensure all fields are present to avoid uncontrolled input errors
      const data = res.data
      const fetchedDiagnosis = data.diagnosis || '';
      const parsedDiagnosis = fetchedDiagnosis ? fetchedDiagnosis.split(', ') : [];

      setForm(prev => ({
        ...prev,
        ...data,
        diagnosis: parsedDiagnosis,
        medicalHistory: { ...prev.medicalHistory, ...(data.medicalHistory || {}) },
        presentGlass: {
          right: { ...prev.presentGlass.right, ...(data.presentGlass?.right || {}) },
          left: { ...prev.presentGlass.left, ...(data.presentGlass?.left || {}) }
        },
        visualAcuity: {
          distance: {
            right: { ...prev.visualAcuity.distance.right, ...(data.visualAcuity?.distance?.right || {}) },
            left: { ...prev.visualAcuity.distance.left, ...(data.visualAcuity?.distance?.left || {}) }
          },
          near: {
            right: { ...prev.visualAcuity.near.right, ...(data.visualAcuity?.near?.right || {}) },
            left: { ...prev.visualAcuity.near.left, ...(data.visualAcuity?.near?.left || {}) }
          }
        },
        objectiveRefraction: {
          right: { ...prev.objectiveRefraction.right, ...(data.objectiveRefraction?.right || {}) },
          left: { ...prev.objectiveRefraction.left, ...(data.objectiveRefraction?.left || {}) }
        },
        subjectiveRefraction: {
          right: { ...prev.subjectiveRefraction.right, ...(data.subjectiveRefraction?.right || {}) },
          left: { ...prev.subjectiveRefraction.left, ...(data.subjectiveRefraction?.left || {}) }
        },
        slitLamp: {
          right: { ...prev.slitLamp.right, ...(data.slitLamp?.right || {}) },
          left: { ...prev.slitLamp.left, ...(data.slitLamp?.left || {}) }
        }
      }))
    } catch (err) {
      console.error(err)
      alert('Error fetching patient details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const [form, setForm] = useState({
    name: '', age: '', gender: '', phone: '', address: '', date: new Date().toISOString().split('T')[0], complaint: '',
    medicalHistory: {
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      glaucoma: false,
      allergies: false,
      medications: '',
      surgeries: '',
      familyHistory: '',
      other: ''
    },
    presentGlass: {
      right: { sph: '', cyl: '', axis: '', add: '', va: '', nv: '' },
      left: { sph: '', cyl: '', axis: '', add: '', va: '', nv: '' }
    },
    visualAcuity: {
      distance: {
        right: { va: '', refraction: '' },
        left: { va: '', refraction: '' }
      },
      near: {
        right: { va: '', refraction: '' },
        left: { va: '', refraction: '' }
      }
    },
    objectiveRefraction: {
      right: { sph: '', cyl: '', axis: '' },
      left: { sph: '', cyl: '', axis: '' }
    },
    subjectiveRefraction: {
      right: { sph: '', cyl: '', axis: '', va: '', add: '', nv: '' },
      left: { sph: '', cyl: '', axis: '', va: '', add: '', nv: '' }
    },
    slitLamp: {
      right: {
        lids: 'OILY SECRETION', conjunctiva: 'QUIET', cornea: 'CLEAR', anteriorChamber: 'DEEP', pupil: 'R/R/R', iris: 'NORMAL COLOR AND PIGMENTED', lens: 'CLEAR'
      },
      left: {
        lids: 'OILY SECRETION', conjunctiva: 'QUIET', cornea: 'CLEAR', anteriorChamber: 'DEEP', pupil: 'R/R/R', iris: 'NORMAL COLOR AND PIGMENTED', lens: 'CLEAR'
      }
    },
    fundus: '',
    diagnosis: [], advice: ''
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

  const submit = async (e, shouldPrint = false) => {
    if (e) e.preventDefault()
    try {
      const payload = { ...form }
      payload.diagnosis = Array.isArray(payload.diagnosis) ? payload.diagnosis.join(', ') : payload.diagnosis;

      if (id) {
        const res = await api.put(`/api/patients/${id}`, payload)
        alert('Patient updated successfully.')
        if (shouldPrint) {
          setPrintingPatient(res.data)
          setTimeout(() => {
            printRef.current?.handlePrint()
            navigate('/')
          }, 250)
          return
        }
      } else {
        const res = await api.post('/api/patients', payload)
        alert('Patient created successfully.')
        if (shouldPrint) {
          setPrintingPatient(res.data)
          setTimeout(() => {
            printRef.current?.handlePrint()
            navigate('/')
          }, 250)
          return
        }
      }
      navigate('/')
    } catch (err) {
      alert('Error saving patient')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-indigo-700 bg-clip-text text-transparent">
              {id ? 'Edit Patient' : 'Add New Patient'}
            </h1>
            <p className="text-slate-600 mt-2">{id ? 'Update' : 'Enter'} comprehensive patient examination details</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
        >
          {/* Personal Information Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  required
                  value={form.age}
                  onChange={e => updateForm('age', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  required
                  value={form.gender}
                  onChange={e => updateForm('gender', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => updateForm('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => updateForm('address', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Examination Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={e => updateForm('date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                <textarea
                  value={form.complaint}
                  onChange={e => updateForm('complaint', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter patient's chief complaint"
                />
              </div>
            </div>
          </motion.div>

          {/* Medical History Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Systemic Diseases
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-700 mb-3">Systemic Diseases</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.medicalHistory.diabetes}
                        onChange={e => updateForm('medicalHistory.diabetes', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Diabetes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.medicalHistory.hypertension}
                        onChange={e => updateForm('medicalHistory.hypertension', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Hypertension</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.medicalHistory.heartDisease}
                        onChange={e => updateForm('medicalHistory.heartDisease', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Heart Disease</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.medicalHistory.glaucoma}
                        onChange={e => updateForm('medicalHistory.glaucoma', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Glaucoma</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.medicalHistory.allergies}
                        onChange={e => updateForm('medicalHistory.allergies', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Allergies</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <textarea
                    value={form.medicalHistory.medications}
                    onChange={e => updateForm('medicalHistory.medications', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="List current medications and dosages"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Past Surgeries</label>
                  <textarea
                    value={form.medicalHistory.surgeries}
                    onChange={e => updateForm('medicalHistory.surgeries', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="List previous surgeries and dates"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                  <textarea
                    value={form.medicalHistory.familyHistory}
                    onChange={e => updateForm('medicalHistory.familyHistory', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Relevant family medical history"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Medical Conditions</label>
                  <textarea
                    value={form.medicalHistory.other}
                    onChange={e => updateForm('medicalHistory.other', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Any other relevant medical history"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Acuity Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              Visual Acuity
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Distance Vision */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Right Eye</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Distance Vision (Unaided)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      value={form.visualAcuity.distance.right.va}
                      onChange={e => updateForm('visualAcuity.distance.right.va', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Near Vision (Unaided)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      value={form.visualAcuity.near.right.va}
                      onChange={e => updateForm('visualAcuity.near.right.va', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Left Eye</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Distance Vision (Unaided)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      value={form.visualAcuity.distance.left.va}
                      onChange={e => updateForm('visualAcuity.distance.left.va', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Near Vision (Unaided)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      value={form.visualAcuity.near.left.va}
                      onChange={e => updateForm('visualAcuity.near.left.va', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Present Glass Prescription */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Present Glass Prescription with Vision</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm text-left text-gray-500 bg-gray-50 rounded-lg overflow-hidden border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th className="px-4 py-3">Eye</th>
                    <th className="px-4 py-3">Spherical</th>
                    <th className="px-4 py-3">Cylinder</th>
                    <th className="px-4 py-3">Axis</th>
                    <th className="px-4 py-3">VA</th>
                    <th className="px-4 py-3">Add</th>
                    <th className="px-4 py-3">NV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Right</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.sph} onChange={e => updateForm('presentGlass.right.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.cyl} onChange={e => updateForm('presentGlass.right.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.axis} onChange={e => updateForm('presentGlass.right.axis', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.va} onChange={e => updateForm('presentGlass.right.va', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.add} onChange={e => updateForm('presentGlass.right.add', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.right.nv} onChange={e => updateForm('presentGlass.right.nv', e.target.value)} /></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Left</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.sph} onChange={e => updateForm('presentGlass.left.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.cyl} onChange={e => updateForm('presentGlass.left.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.axis} onChange={e => updateForm('presentGlass.left.axis', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.va} onChange={e => updateForm('presentGlass.left.va', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.add} onChange={e => updateForm('presentGlass.left.add', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.presentGlass.left.nv} onChange={e => updateForm('presentGlass.left.nv', e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Refraction Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Objective Refraction
            </h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full min-w-[600px] text-sm text-left text-gray-500 bg-gray-50 rounded-lg overflow-hidden border">
                <thead className="text-xs text-gray-700 uppercase bg-purple-100">
                  <tr>
                    <th className="px-4 py-3">Eye</th>
                    <th className="px-4 py-3">Spherical</th>
                    <th className="px-4 py-3">Cylinder</th>
                    <th className="px-4 py-3">Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Right</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.right.sph} onChange={e => updateForm('objectiveRefraction.right.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.right.cyl} onChange={e => updateForm('objectiveRefraction.right.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.right.axis} onChange={e => updateForm('objectiveRefraction.right.axis', e.target.value)} /></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Left</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.left.sph} onChange={e => updateForm('objectiveRefraction.left.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.left.cyl} onChange={e => updateForm('objectiveRefraction.left.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.objectiveRefraction.left.axis} onChange={e => updateForm('objectiveRefraction.left.axis', e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Subjective Refraction
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm text-left text-gray-500 bg-gray-50 rounded-lg overflow-hidden border">
                <thead className="text-xs text-gray-700 uppercase bg-indigo-100">
                  <tr>
                    <th className="px-4 py-3">Eye</th>
                    <th className="px-4 py-3">Spherical</th>
                    <th className="px-4 py-3">Cylinder</th>
                    <th className="px-4 py-3">Axis</th>
                    <th className="px-4 py-3">VA</th>
                    <th className="px-4 py-3">Add</th>
                    <th className="px-4 py-3">NV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Right</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.sph} onChange={e => updateForm('subjectiveRefraction.right.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.cyl} onChange={e => updateForm('subjectiveRefraction.right.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.axis} onChange={e => updateForm('subjectiveRefraction.right.axis', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.va} onChange={e => updateForm('subjectiveRefraction.right.va', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.add} onChange={e => updateForm('subjectiveRefraction.right.add', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.right.nv} onChange={e => updateForm('subjectiveRefraction.right.nv', e.target.value)} /></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">Left</td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.sph} onChange={e => updateForm('subjectiveRefraction.left.sph', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.cyl} onChange={e => updateForm('subjectiveRefraction.left.cyl', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.axis} onChange={e => updateForm('subjectiveRefraction.left.axis', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.va} onChange={e => updateForm('subjectiveRefraction.left.va', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.add} onChange={e => updateForm('subjectiveRefraction.left.add', e.target.value)} /></td>
                    <td className="px-2 py-2"><input type="text" className="w-full p-2 border rounded" value={form.subjectiveRefraction.left.nv} onChange={e => updateForm('subjectiveRefraction.left.nv', e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Slit Lamp Examination */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              Slit Lamp Examination
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Right Eye */}
              <div className="bg-white/60 p-6 rounded-xl border border-orange-100">
                <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b pb-2">Right Eye</h4>
                <div className="space-y-4">
                  {['lids', 'conjunctiva', 'cornea', 'anteriorChamber', 'pupil', 'iris', 'lens'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input
                        type="text"
                        value={form.slitLamp.right[field]}
                        onChange={e => updateForm(`slitLamp.right.${field}`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Left Eye */}
              <div className="bg-white/60 p-6 rounded-xl border border-orange-100">
                <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b pb-2">Left Eye</h4>
                <div className="space-y-4">
                  {['lids', 'conjunctiva', 'cornea', 'anteriorChamber', 'pupil', 'iris', 'lens'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input
                        type="text"
                        value={form.slitLamp.left[field]}
                        onChange={e => updateForm(`slitLamp.left.${field}`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diagnosis and Advice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Diagnosis & Advice
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fundus</label>
                <textarea
                  value={form.fundus}
                  onChange={e => updateForm('fundus', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter fundus examination details"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 font-bold text-lg">Diagnosis (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white/50 backdrop-blur-sm p-6 border-2 border-gray-200 rounded-2xl shadow-inner">
                  {['Myopia', 'Hypermetropia', 'Presbyopia', 'Astigmatism', 'Cataract', 'Glaucoma', 'Intraocular Lens', 'Diabetic Retinopathy', 'Conjunctivitis', 'Dry Eye', 'Corneal Ulcer', 'Retinal Detachment'].map(item => (
                    <label key={item} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-200 group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={form.diagnosis.includes(item)}
                          onChange={e => {
                            const newDiagnosis = e.target.checked
                              ? [...form.diagnosis, item]
                              : form.diagnosis.filter(d => d !== item);
                            updateForm('diagnosis', newDiagnosis);
                          }}
                          className="peer w-5 h-5 text-red-600 border-2 border-gray-300 rounded-lg focus:ring-red-500 focus:ring-offset-2 transition-all cursor-pointer appearance-none checked:bg-red-500 checked:border-red-500"
                        />
                        <svg className="w-3.5 h-3.5 absolute left-0.5 pointer-events-none hidden peer-checked:block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700 transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
                <textarea
                  value={form.advice}
                  onChange={e => updateForm('advice', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter treatment advice and follow-up instructions"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={(e) => submit(e, true)}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {id ? 'Update & Print' : 'Save & Print'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {id ? 'Update Patient' : 'Save Patient'}
            </motion.button>
          </motion.div>
        </motion.form>
        <PrintWrapper ref={printRef} patient={printingPatient} />
      </div>
    </motion.div>
  )
}