import React from 'react'
import SignupForm from '../features/auth/RegisterForm'

import { motion } from 'framer-motion' 

function Signup() {
  return (
    <div className='py-8'>
      <motion.section
        className="pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SignupForm/>
      </motion.section>
    </div>
  )
}

export default Signup