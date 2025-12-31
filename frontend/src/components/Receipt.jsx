import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const CLINIC_NAME = 'Sri Satya Eye Care and Opticals'
const CLINIC_ADDRESS = 'Hiramandalam, Near RTC Bus Stand, Main Road, Hiramandalam'
const DOCTOR = 'DHARMANA KAMESWARA RAO'
const DOCTOR_PHONE = '95736 93655'

const Receipt = forwardRef(({ patient }, ref) => {
  if (!patient) return <div ref={ref}>No patient selected</div>
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="p-10 bg-gradient-to-br from-white via-gray-50 to-blue-50 text-black shadow-2xl rounded-3xl border-2 border-sky-100" style={{ width: 850, fontFamily: 'serif' }}>
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-center mb-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-gradient-to-br from-sky-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-3">{CLINIC_NAME}</h1>
        <p className="text-lg text-gray-600 mb-2">{CLINIC_ADDRESS}</p>
        <p className="text-base text-gray-600 mb-4">Optometrist: <span className="font-semibold text-sky-700">{DOCTOR}</span> | Phone: <span className="font-semibold">{DOCTOR_PHONE}</span></p>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-32 h-1 bg-gradient-to-r from-sky-400 to-teal-500 mx-auto rounded-full"></motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-400 mb-2">PATIENT EXAMINATION REPORT</h2>
        <p className="text-lg text-gray-600">Medical Record #{patient.mrNo}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
        <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-sky-100">
          <h3 className="text-xl font-bold text-sky-700 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Information
          </h3>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-sky-50 text-sky-800 rounded-l-lg">MR No</td>
                <td className="p-4 text-gray-800">{patient.mrNo}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-sky-50 text-sky-800">Name</td>
                <td className="p-4 text-gray-800">{patient.name}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-sky-50 text-sky-800">Age / Gender</td>
                <td className="p-4 text-gray-800">{patient.age} / {patient.gender}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-sky-50 text-sky-800">Phone</td>
                <td className="p-4 text-gray-800">{patient.phone}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-sky-50 text-sky-800">Address</td>
                <td className="p-4 text-gray-800">{patient.address}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold bg-sky-50 text-sky-800 rounded-l-lg">Date</td>
                <td className="p-4 text-gray-800">{patient.date ? new Date(patient.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-teal-100">
          <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Examination Details
          </h3>
          <table className="w-full border-collapse mb-6">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-teal-50 text-teal-800 rounded-l-lg w-1/4">Cheif Complaint</td>
                <td className="p-4 text-gray-800">{patient.complaint}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-semibold bg-teal-50 text-teal-800">Systemic Diseases</td>
                <td className="p-4 text-gray-800">
                  <div className="space-y-1 text-sm">
                    {patient.medicalHistory?.diabetes && <div><strong>✓</strong> Diabetes</div>}
                    {patient.medicalHistory?.hypertension && <div><strong>✓</strong> Hypertension</div>}
                    {patient.medicalHistory?.heartDisease && <div><strong>✓</strong> Heart Disease</div>}
                    {patient.medicalHistory?.glaucoma && <div><strong>✓</strong> Glaucoma</div>}
                    {patient.medicalHistory?.allergies && <div><strong>✓</strong> Allergies</div>}
                    {patient.medicalHistory?.medications && <div><strong>Medications:</strong> {patient.medicalHistory.medications}</div>}
                    {patient.medicalHistory?.surgeries && <div><strong>Surgeries:</strong> {patient.medicalHistory.surgeries}</div>}
                    {patient.medicalHistory?.familyHistory && <div><strong>Family History:</strong> {patient.medicalHistory.familyHistory}</div>}
                    {patient.medicalHistory?.other && <div><strong>Other:</strong> {patient.medicalHistory.other}</div>}
                    {!patient.medicalHistory?.diabetes && !patient.medicalHistory?.hypertension && !patient.medicalHistory?.heartDisease &&
                      !patient.medicalHistory?.allergies && !patient.medicalHistory?.medications && !patient.medicalHistory?.surgeries &&
                      !patient.medicalHistory?.familyHistory && !patient.medicalHistory?.other && <div>No significant medical history</div>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Visual Acuity */}
          {patient.visualAcuity && (
            <div className="mb-6">
              <h4 className="font-semibold text-teal-800 mb-2 bg-teal-50 p-2 rounded">Visual Acuity</h4>
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Right Eye</th>
                    <th className="p-2 border">Left Eye</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.visualAcuity.distance && (
                    <tr>
                      <td className="p-2 border font-medium">Distance Vision</td>
                      <td className="p-2 border">{patient.visualAcuity.distance.right?.va || '-'}</td>
                      <td className="p-2 border">{patient.visualAcuity.distance.left?.va || '-'}</td>
                    </tr>
                  )}
                  {patient.visualAcuity.near && (
                    <tr>
                      <td className="p-2 border font-medium">Near Vision</td>
                      <td className="p-2 border">{patient.visualAcuity.near.right?.va || '-'}</td>
                      <td className="p-2 border">{patient.visualAcuity.near.left?.va || '-'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Present Glass */}
          {patient.presentGlass && (
            <div className="mb-6">
              <h4 className="font-semibold text-teal-800 mb-2 bg-teal-50 p-2 rounded">Present Glass Prescription</h4>
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Eye</th>
                    <th className="p-2 border">Sph</th>
                    <th className="p-2 border">Cyl</th>
                    <th className="p-2 border">Axis</th>
                    <th className="p-2 border">VA</th>
                    <th className="p-2 border">Add</th>
                    <th className="p-2 border">NV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-medium">Right</td>
                    <td className="p-2 border">{patient.presentGlass.right.sph}</td>
                    <td className="p-2 border">{patient.presentGlass.right.cyl}</td>
                    <td className="p-2 border">{patient.presentGlass.right.axis}</td>
                    <td className="p-2 border">{patient.presentGlass.right.va}</td>
                    <td className="p-2 border">{patient.presentGlass.right.add}</td>
                    <td className="p-2 border">{patient.presentGlass.right.nv}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Left</td>
                    <td className="p-2 border">{patient.presentGlass.left.sph}</td>
                    <td className="p-2 border">{patient.presentGlass.left.cyl}</td>
                    <td className="p-2 border">{patient.presentGlass.left.axis}</td>
                    <td className="p-2 border">{patient.presentGlass.left.va}</td>
                    <td className="p-2 border">{patient.presentGlass.left.add}</td>
                    <td className="p-2 border">{patient.presentGlass.left.nv}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Objective Refraction */}
          {patient.objectiveRefraction && (
            <div className="mb-6">
              <h4 className="font-semibold text-teal-800 mb-2 bg-teal-50 p-2 rounded">Objective Refraction</h4>
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Eye</th>
                    <th className="p-2 border">Sph</th>
                    <th className="p-2 border">Cyl</th>
                    <th className="p-2 border">Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-medium">Right</td>
                    <td className="p-2 border">{patient.objectiveRefraction.right.sph}</td>
                    <td className="p-2 border">{patient.objectiveRefraction.right.cyl}</td>
                    <td className="p-2 border">{patient.objectiveRefraction.right.axis}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Left</td>
                    <td className="p-2 border">{patient.objectiveRefraction.left.sph}</td>
                    <td className="p-2 border">{patient.objectiveRefraction.left.cyl}</td>
                    <td className="p-2 border">{patient.objectiveRefraction.left.axis}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Subjective Refraction */}
          {patient.subjectiveRefraction && (
            <div className="mb-6">
              <h4 className="font-semibold text-teal-800 mb-2 bg-teal-50 p-2 rounded">Subjective Refraction</h4>
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Eye</th>
                    <th className="p-2 border">Sph</th>
                    <th className="p-2 border">Cyl</th>
                    <th className="p-2 border">Axis</th>
                    <th className="p-2 border">VA</th>
                    <th className="p-2 border">Add</th>
                    <th className="p-2 border">NV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-medium">Right</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.sph}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.cyl}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.axis}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.va}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.add}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.right.nv}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Left</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.sph}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.cyl}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.axis}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.va}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.add}</td>
                    <td className="p-2 border">{patient.subjectiveRefraction.left.nv}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Slit Lamp Examination */}
          {patient.slitLamp && (
            <div className="mb-6">
              <h4 className="font-semibold text-teal-800 mb-2 bg-teal-50 p-2 rounded">Slit Lamp Examination</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <h5 className="font-semibold text-center mb-2 border-b pb-1">Right Eye</h5>
                  <div className="text-sm space-y-1">
                    {['lids', 'conjunctiva', 'cornea', 'anteriorChamber', 'pupil', 'iris', 'lens'].map(field => (
                      patient.slitLamp.right[field] && (
                        <div key={field} className="flex justify-between">
                          <span className="capitalize text-gray-600">{field.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{patient.slitLamp.right[field]}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="border rounded p-3">
                  <h5 className="font-semibold text-center mb-2 border-b pb-1">Left Eye</h5>
                  <div className="text-sm space-y-1">
                    {['lids', 'conjunctiva', 'cornea', 'anteriorChamber', 'pupil', 'iris', 'lens'].map(field => (
                      patient.slitLamp.left[field] && (
                        <div key={field} className="flex justify-between">
                          <span className="capitalize text-gray-600">{field.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{patient.slitLamp.left[field]}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {patient.fundus && (
              <div className="flex">
                <div className="w-1/4 font-semibold bg-teal-50 p-2 text-teal-800 rounded">Fundus</div>
                <div className="w-3/4 p-2 border-b border-gray-100">{patient.fundus}</div>
              </div>
            )}
            <div className="flex">
              <div className="w-1/4 font-semibold bg-teal-50 p-2 text-teal-800 rounded">Diagnosis</div>
              <div className="w-3/4 p-2 border-b border-gray-100">{patient.diagnosis}</div>
            </div>
            <div className="flex">
              <div className="w-1/4 font-semibold bg-teal-50 p-2 text-teal-800 rounded">Advice</div>
              <div className="w-3/4 p-2 border-b border-gray-100">{patient.advice}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 pt-8 border-t-2 border-sky-200">
        <div className="flex justify-between items-end">
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div className="border-b-2 border-gray-400 w-56 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">Patient Signature</p>
            <p className="text-xs text-gray-500 mt-1">Date: _______________</p>
          </motion.div>
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <div className="border-b-2 border-gray-400 w-56 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">Optometrist Signature</p>
            <p className="text-xs text-gray-500 mt-1">{DOCTOR}</p>
            <p className="text-xs text-gray-500">DOT,DOA,VT in L V Prassad Eye Hospital</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
        <p className="font-medium">Sri Satya Eye Care and Opticals</p>
        <p>Printed on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-xs mt-2">This is a computer generated report and does not require signature</p>
      </motion.div>
    </motion.div>
  )
})

export default Receipt