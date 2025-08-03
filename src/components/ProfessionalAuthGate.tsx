import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { authenticateUser } from '../utils/auth'
import { User as UserType } from '../types/auth'

interface ProfessionalAuthGateProps {
  children: React.ReactNode
  onAuthenticated: (user: UserType) => void
}

export const ProfessionalAuthGate: React.FC<ProfessionalAuthGateProps> = ({ 
  children, 
  onAuthenticated 
}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [shieldClicks, setShieldClicks] = useState(0)
  const [showAdminAccess, setShowAdminAccess] = useState(false)

  const handleShieldClick = () => {
    const newClickCount = shieldClicks + 1
    setShieldClicks(newClickCount)
    
    if (newClickCount === 6) {
      setShowAdminAccess(true)
      // Create admin user directly
      const adminUser: UserType = {
        id: 'admin-secret',
        username: 'Admin',
        password: 'secret',
        full_name: 'Vanguard Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setIsSuccess(true)
      setTimeout(() => {
        onAuthenticated(adminUser)
      }, 1000)
    }
    
    // Reset clicks after 3 seconds if not reached 6
    if (newClickCount < 6) {
      setTimeout(() => {
        setShieldClicks(0)
      }, 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = await authenticateUser(credentials.username, credentials.password)
    
    if (user) {
      setIsSuccess(true)
      setTimeout(() => {
        onAuthenticated(user)
      }, 1000)
    } else {
      setError('Invalid username or password')
      setCredentials({ username: '', password: '' })
    }
    
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 30px rgba(34, 197, 94, 0.6)",
                "0 0 60px rgba(34, 197, 94, 0.8)",
                "0 0 30px rgba(34, 197, 94, 0.6)"
              ]
            }}
            transition={{ duration: 1 }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Authentication Successful
          </motion.h1>
          <motion.p 
            className="text-xl text-green-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {showAdminAccess ? 'Welcome, Administrator' : 'Welcome to Vanguard'}
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl cursor-pointer relative"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.4)",
                  "0 0 40px rgba(59, 130, 246, 0.6)",
                  "0 0 20px rgba(59, 130, 246, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleShieldClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Shield className="w-10 h-10 text-white" />
              
              {/* Click indicator */}
              <AnimatePresence>
                {shieldClicks > 0 && shieldClicks < 6 && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {shieldClicks}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Vanguard Portal</h1>
            <p className="text-blue-200">Secure Access to Feedback System</p>
            
            {shieldClicks > 0 && shieldClicks < 6 && (
              <motion.p 
                className="text-yellow-300 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {6 - shieldClicks} more clicks for admin access
              </motion.p>
            )}
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold mb-3">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="bg-red-500/20 border border-red-400/50 rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-300" />
                      <span className="text-red-200 font-medium">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading || !credentials.username || !credentials.password}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-blue-200 text-sm">
                Secure access to the Vanguard feedback system
              </p>
              {shieldClicks > 0 && shieldClicks < 6 && (
                <motion.p 
                  className="text-center text-yellow-300 text-xs mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Secret admin access: {shieldClicks}/6 clicks
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}