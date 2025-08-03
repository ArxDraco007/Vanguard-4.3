import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Star, MessageSquare, Plus, Search } from 'lucide-react'
import { candidatesWithClasses } from '../data/classes'
import { User as UserType } from '../types/auth'
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

interface TeacherFeedbackSystemProps {
  currentUser: UserType
}

export const TeacherFeedbackSystem: React.FC<TeacherFeedbackSystemProps> = ({ currentUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackRating[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    comments: ''
  })

  useEffect(() => {
    fetchFeedbacks()
  }, [currentUser.id])

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_ratings')
        .select('*')
        .eq('reviewer_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    }
  }

  const filteredCandidates = candidatesWithClasses.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmitFeedback = async () => {
    if (!selectedCandidate) return

    setIsSubmitting(true)
    
    try {
      console.log('Submitting feedback with data:', {
        candidate_id: selectedCandidate,
        reviewer_id: currentUser.id,
        reviewer_type: currentUser.role,
        rating: newFeedback.rating,
        comments: newFeedback.comments
      })
      
      const { error } = await supabase
        .from('feedback_ratings')
        .insert([{
          candidate_id: selectedCandidate,
          reviewer_id: currentUser.id,
          reviewer_type: currentUser.role as 'teacher' | 'dorm_parent',
          rating: newFeedback.rating,
          comments: newFeedback.comments
        }])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Feedback submitted successfully')
      await fetchFeedbacks()
      setNewFeedback({ rating: 5, comments: '' })
      setShowFeedbackModal(false)
      setSelectedCandidate(null)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to submit feedback: ${errorMessage}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCandidateFeedbacks = (candidateId: string) => {
    return feedbacks.filter(f => f.candidate_id === candidateId)
  }

  const getAverageRating = (candidateId: string) => {
    const candidateFeedbacks = getCandidateFeedbacks(candidateId)
    if (candidateFeedbacks.length === 0) return 0
    return candidateFeedbacks.reduce((sum, f) => sum + f.rating, 0) / candidateFeedbacks.length
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
    if (rating >= 8) return 'text-green-600 bg-green-100'
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100'
    if (rating >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const selectedCandidateName = selectedCandidate 
    ? candidatesWithClasses.find(c => c.id === selectedCandidate)?.name 
    : ''

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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border ${
                  currentUser.role === 'teacher' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-blue-500/25 border-blue-500/30'
                    : 'bg-gradient-to-br from-green-600 to-green-800 shadow-green-500/25 border-green-500/30'
                }`}>
                  {currentUser.role === 'teacher' ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Candidate Feedback</h1>
                  <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                    {currentUser.role === 'teacher' ? 'Teacher Portal' : 'Dorm Parent Portal'} • {currentUser.full_name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">{filteredCandidates.length}</div>
                <div className="text-sm text-gray-300">Candidates</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-blue-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </motion.div>

          {/* Candidates Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredCandidates.map((candidate, index) => {
              const candidateFeedbacks = getCandidateFeedbacks(candidate.id)
              const averageRating = getAverageRating(candidate.id)
              
              return (
                <motion.div
                  key={candidate.id}
                  className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-600/30 hover:border-blue-500/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate.id)
                        setShowFeedbackModal(true)
                      }}
                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-white mb-2 text-sm leading-tight">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">{candidate.title}</p>
                  
                  {candidateFeedbacks.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">
                          {averageRating.toFixed(1)}/10
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({candidateFeedbacks.length} review{candidateFeedbacks.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Recent Feedbacks */}
                  {candidateFeedbacks.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {candidateFeedbacks.slice(0, 2).map(feedback => (
                        <div key={feedback.id} className="bg-black/20 rounded-lg p-3 border border-gray-600/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating}/10
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(feedback.created_at)}</span>
                          </div>
                          {feedback.comments && (
                            <p className="text-gray-300 text-xs leading-relaxed">{feedback.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {candidateFeedbacks.length === 0 && (
                    <div className="text-center py-4">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-gray-400 text-sm">No feedback yet</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedbackModal && selectedCandidate && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Feedback</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {selectedCandidateName}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Providing feedback as: {currentUser.role === 'teacher' ? 'Teacher' : 'Dorm Parent'}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Rating (1-10)
                    </label>
                    <div className="flex items-center gap-2 mb-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewFeedback({ ...newFeedback, rating: num })}
                          className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                            newFeedback.rating >= num
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      <span className={`px-4 py-2 rounded-full font-bold ${getRatingColor(newFeedback.rating)}`}>
                        {newFeedback.rating}/10
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={newFeedback.comments}
                      onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                      placeholder="Add any additional comments..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      setShowFeedbackModal(false)
                      setSelectedCandidate(null)
                      setNewFeedback({ rating: 5, comments: '' })
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </VanguardScene>
  )
}