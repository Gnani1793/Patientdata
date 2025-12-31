import React from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import { useReactToPrint } from 'react-to-print'
import Receipt from './Receipt'

export default function PatientList({patients, onRefresh}){
  const [selected, setSelected] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const ref = React.useRef()

  const handlePrint = (patient) => {
    setSelected(patient)
    setTimeout(()=>{
      ref.current && ref.current.handlePrint()
    },50)
  }

  const exportExcel = async ()=>{
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
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
      <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.1}}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div className="flex-1 max-w-md">
          <motion.input
            whileFocus={{scale:1.02, boxShadow:'0 0 0 4px rgba(14,165,233,0.1)'}}
            initial={{opacity:0, x:-20}}
            animate={{opacity:1, x:0}}
            transition={{delay:0.2}}
            placeholder="Search MR No or Name"
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all bg-white/90 backdrop-blur-sm"
          />
        </div>
        <motion.button
          whileHover={{scale:1.05, boxShadow:'0 10px 25px rgba(16,185,129,0.3)'}}
          whileTap={{scale:0.95}}
          initial={{opacity:0, x:20}}
          animate={{opacity:1, x:0}}
          transition={{delay:0.3}}
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
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.4}}
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
                  initial={{opacity:0, y:20}}
                  animate={{opacity:1, y:0}}
                  transition={{delay:0.1 * index}}
                  whileHover={{backgroundColor:'rgba(14,165,233,0.05)'}}
                  className="border-b border-gray-100 hover:bg-sky-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-sky-700">{patient.mrNo}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{patient.name}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.age}/{patient.gender}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.date ? new Date(patient.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      whileHover={{scale:1.1}}
                      whileTap={{scale:0.9}}
                      onClick={()=>handlePrint(patient)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center mx-auto"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPatients.length === 0 && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
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
      <motion.table
        initial={{opacity:0}}
        animate={{opacity:1}}
        className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg"
      >
        <thead className="bg-gradient-to-r from-sky-600 to-teal-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">MR No</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredPatients.map((p, index) => (
            <motion.tr
              key={p._id}
              initial={{opacity:0, x:-20}}
              animate={{opacity:1, x:0}}
              transition={{delay:index*0.05}}
              whileHover={{backgroundColor:'#f8fafc', scale:1.01}}
              className="hover:shadow-md transition-all"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.mrNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <motion.button
                  whileHover={{scale:1.1}}
                  whileTap={{scale:0.9}}
                  className="px-3 py-1 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 transition-colors"
                  onClick={()=>handlePrint(p)}
                >
                  Print Receipt
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <div style={{display:'none'}}>
        <PrintWrapper ref={ref} patient={selected} />
      </div>
    </motion.div>
  )
}

const PrintWrapper = React.forwardRef(({patient}, ref) => {
  const componentRef = React.useRef()
  const handlePrint = useReactToPrint({ content: ()=>componentRef.current })
  React.useImperativeHandle(ref, ()=>({ handlePrint }))
  return <div><Receipt ref={componentRef} patient={patient} /></div>
})