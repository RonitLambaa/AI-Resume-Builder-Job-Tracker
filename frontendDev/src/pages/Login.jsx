import React from 'react'
import LoginForm from "../features/auth/LoginForm"
import { motion } from "framer-motion";

function Login() {
  return (
    <div>
      <motion.section
        className="pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LoginForm/>
      </motion.section>
    </div>
  )
}

export default Login