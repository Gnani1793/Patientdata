import React from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import { useReactToPrint } from 'react-to-print'
import Receipt from './Receipt'
import PrintWrapper from './PrintWrapper'
import { formatPatientMessage } from '../utils/whatsappFormatter'

import { useNavigate } from 'react-router-dom'

export default function PatientList({ patients, onRefresh }) {
  const navigate = useNavigate()
  const [selected, setSelected] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const ref = React.useRef()

  const handlePrint = (patient) => {
    setSelected(patient)
    setTimeout(() => {
      if (ref.current) {
        ref.current.handlePrint()
      }
    }, 250)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/api/patients/${id}`)
        onRefresh()
      } catch (err) {
        alert('Failed to delete patient')
      }
    }
  }

  const exportExcel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/patients/export/excel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sseye_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'patients.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download Excel file')
    }
  }

  const filteredPatients = patients.filter(p =>
    p.mrNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div className="flex-1 max-w-md">
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: '0 0 0 4px rgba(14,165,233,0.1)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            placeholder="Search MR No or Name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/90 backdrop-blur-sm"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={exportExcel}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">MR No</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Age/Gender</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ backgroundColor: 'rgba(14,165,233,0.05)' }}
                  className="border-b border-gray-100 hover:bg-sky-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-sky-700">{patient.mrNo}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{patient.name}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.age}/{patient.gender}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.date ? new Date(patient.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/edit/${patient._id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:from-amber-600 hover:to-orange-600 transition-all flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(patient._id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium rounded-lg shadow-md hover:from-red-600 hover:to-rose-600 transition-all flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          if (!patient.phone) {
                            alert('No phone number found for this patient.');
                            return;
                          }
                          const message = formatPatientMessage(patient);
                          const phone = patient.phone;
                          if (window.confirm(`Send WhatsApp message to ${patient.name} automatically?`)) {
                            try {
                              await api.post('/api/whatsapp/send', { phone, message });
                              alert('Message sent successfully!');
                            } catch (err) {
                              console.error(err);
                              alert('Failed to send message. ' + (err.response?.data?.msg || 'Make sure WhatsApp is connected in the dashboard.'));
                            }
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg shadow-md hover:from-green-600 hover:to-emerald-600 transition-all flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c.93.509 1.842.836 2.805.836h.001c3.182 0 5.768-2.586 5.768-5.766.001-1.541-.599-2.986-1.688-4.075C15.017 7.03 13.57 6.173 12.031 6.172zm0 10.291c-.85-.001-1.666-.252-2.395-.694l-.168-.103-1.789.475.48-1.728-.112-.178c-.496-.788-.758-1.693-.757-2.617 0-2.691 2.193-4.881 4.885-4.881 1.303 0 2.53.508 3.451 1.432.922.923 1.43 2.15 1.429 3.454.001 2.69-2.19 4.881-4.883 4.881h-.141z" />
                          <path d="M12.031 0C5.396 0 0 5.396 0 12.031c0 2.121.55 4.166 1.587 5.968L0 24.062l6.233-1.636c1.743.951 3.735 1.452 5.795 1.453h.003c6.635 0 12.031-5.396 12.031-12.031C24.061 5.485 18.577 0 12.031 0zM12.031 22.08c-1.85-.001-3.666-.499-5.263-1.448l-.377-.225-3.903 1.026 1.042-3.805-.246-.391c-1.046-1.666-1.597-3.597-1.595-5.567.004-5.759 4.69-10.443 10.453-10.443 2.788 0 5.412 1.085 7.391 3.064 1.977 1.977 3.064 4.606 3.063 7.395-.002 5.761-4.691 10.448-10.453 10.448z" />
                        </svg>
                        WhatsApp
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePrint(patient)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m-.5-4.5a7.963 7.963 0 0115 0c0 1.568-.46 3.02-1.24 4.247" />
            </svg>
            <p className="text-gray-500 text-lg">No patients found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.div>

      <PrintWrapper ref={ref} patient={selected} />
    </motion.div>
  )
}