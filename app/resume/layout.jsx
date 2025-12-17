import React from 'react'
import Header from '../../components/Header'

function ResumeLayout({ children }) {
  return (
    <div>
      <Header/>
      <div className=''>
        {children}
      </div>
      
    </div>
  )
}

export default ResumeLayout