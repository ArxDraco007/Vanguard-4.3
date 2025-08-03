import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, GraduationCap, Home, Star, MessageSquare, TrendingUp, Filter } from 'lucide-react'
import { candidatesWithClasses } from '../data/classes'
import { VanguardScene } from './3D/VanguardScene'
import { supabase } from '../lib/supabase'

interface FeedbackRating {
  id: string
  candidate_id: string
  reviewer_id: string
  reviewer_type: 'teacher' | 'dorm_parent'
  rating: number
  comments: string
  created_at: string
  updated_at: string
}

export const AdminFeedbackAnalytics: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackRating[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all')
  const [selectedReviewerType, setSelectedReviewerType] = useState<string>('all')

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_ratings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesCandidate = selectedCandidate === 'all' || feedback.candidate_id === selectedCandidate
    const matchesReviewerType = selectedReviewerType === 'all' || feedback.reviewer_type === selectedReviewerType
    return matchesCandidate && matchesReviewerType
  })

  const getStats = () => {
    const teacherFeedbacks = filteredFeedbacks.filter(f => f.reviewer_type === 'teacher')
    const dormParentFeedbacks = filteredFeedbacks.filter(f => f.reviewer_type === 'dorm_parent')
    
    const avgTeacherRating = teacherFeedbacks.length > 0 
      ? teacherFeedbacks.reduce((sum, f) => sum + f.rating, 0) / teacherFeedbacks.length 
      : 0
    
    const avgDormParentRating = dormParentFeedbacks.length > 0 
      ? dormParentFeedbacks.reduce((sum, f) => sum + f.rating, 0) / dormParentFeedbacks.length 
      : 0

    return {
      total: filteredFeedbacks.length,
      teacherCount: teacherFeedbacks.length,
      dormParentCount: dormParentFeedbacks.length,
      avgTeacherRating,
      avgDormParentRating,
      uniqueCandidates: new Set(filteredFeedbacks.map(f => f.candidate_id)).size
    }
  }

  const stats = getStats()

  const getCandidateName = (candidateId: string) => {
    return candidatesWithClasses.find(c => c.id === candidateId)?.name || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800 border-green-200'
    if (rating >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (rating >= 4) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <VanguardScene>
      <div className="min-h-screen bg-gradient-to-br from-black/20 via-red-900/10 to-black/30 backdrop-blur-sm">
        {/* Header */}
        <motion.div 
          className="bg-black/40 backdrop-blur-md shadow-2xl border-b border-red-500/20 sticky top-0 z-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 border border-purple-500/30">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Feedback Analytics</h1>
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
                    Teacher & Dorm Parent Feedback Overview
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-purple-300">Total Reviews</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: BarChart3, label: 'Total Reviews', value: stats.total, color: 'purple' },
              { icon: GraduationCap, label: 'Teacher Reviews', value: stats.teacherCount, color: 'blue' },
              { icon: Home, label: 'Dorm Parent Reviews', value: stats.dormParentCount, color: 'green' },
              { icon: Star, label: 'Avg Teacher Rating', value: stats.avgTeacherRating.toFixed(1), color: 'yellow' },
              { icon: Star, label: 'Avg Dorm Rating', value: stats.avgDormParentRating.toFixed(1), color: 'orange' },
              { icon: Users, label: 'Candidates Reviewed', value: stats.uniqueCandidates, color: 'indigo' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`bg-${stat.color}-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-${stat.color}-400/30`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-3`} />
                <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                <div className={`text-sm font-medium text-${stat.color}-300`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Filters:</span>
              </div>
              
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Candidates</option>
                {candidatesWithClasses.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                ))}
              </select>

              <select
                value={selectedReviewerType}
                onChange={(e) => setSelectedReviewerType(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Reviewer Types</option>
                <option value="teacher">Teachers Only</option>
                <option value="dorm_parent">Dorm Parents Only</option>
              </select>
            </div>
          </motion.div>

          {/* Feedback Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Teacher Feedback Section */}
            <motion.div 
              className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                Teacher Feedback
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div 
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedbacks
                    .filter(f => f.reviewer_type === 'teacher')
                    .map((feedback, index) => (
                      <motion.div
                        key={feedback.id}
                        className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-white">{getCandidateName(feedback.candidate_id)}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}/10
                          </span>
                        </div>
                        {feedback.comments && (
                          <p className="text-gray-300 text-sm mb-2">{feedback.comments}</p>
                        )}
                        <div className="text-xs text-gray-400">{formatDate(feedback.created_at)}</div>
                      </motion.div>
                    ))}
                  
                  {filteredFeedbacks.filter(f => f.reviewer_type === 'teacher').length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-400/50" />
                      <p className="text-gray-400">No teacher feedback found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Dorm Parent Feedback Section */}
            <motion.div 
              className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-500/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Home className="w-6 h-6 text-green-400" />
                Dorm Parent Feedback
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div 
                    className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedbacks
                    .filter(f => f.reviewer_type === 'dorm_parent')
                    .map((feedback, index) => (
                      <motion.div
                        key={feedback.id}
                        className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-white">{getCandidateName(feedback.candidate_id)}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}/10
                          </span>
                        </div>
                        {feedback.comments && (
                          <p className="text-gray-300 text-sm mb-2">{feedback.comments}</p>
                        )}
                        <div className="text-xs text-gray-400">{formatDate(feedback.created_at)}</div>
                      </motion.div>
                    ))}
                  
                  {filteredFeedbacks.filter(f => f.reviewer_type === 'dorm_parent').length === 0 && (
                    <div className="text-center py-8">
                      <Home className="w-12 h-12 mx-auto mb-4 text-green-400/50" />
                      <p className="text-gray-400">No dorm parent feedback found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </VanguardScene>
  )
}