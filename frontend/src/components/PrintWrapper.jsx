import React from 'react'
import { useReactToPrint } from 'react-to-print'
import Receipt from './Receipt'

const PrintWrapper = React.forwardRef(({ patient }, ref) => {
  const componentRef = React.useRef()
  const handlePrint = useReactToPrint({ 
    content: () => componentRef.current,
    documentTitle: `Receipt_${patient?.mrNo || 'Patient'}`
  })
  
  React.useImperativeHandle(ref, () => ({ handlePrint }))
  
  return (
    <div style={{ display: 'none' }}>
      <div ref={componentRef}>
        <Receipt patient={patient} />
      </div>
    </div>
  )
})

export default PrintWrapper
