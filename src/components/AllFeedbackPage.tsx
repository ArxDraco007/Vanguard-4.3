import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, User, Search, Filter, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { VanguardScene } from './3D/VanguardScene'
import { candidatesWithClasses } from '../data/classes'
import { modules } from '../data/modules'
import { supabase } from '../lib/supabase'

interface FeedbackWithDetails {
  id: string
  candidate_id: string
  candidate_name: string
  module_id: string
  module_name: string
  session_type: string
  feedback_text: string
  feedback_type: string
  author: string
  created_at: string
}

export const AllFeedbackPage: React.FC = () => {
  const [allFeedback, setAllFeedback] = useState<FeedbackWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    fetchAllFeedback()
  }, [])

  const fetchAllFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Enrich feedback with candidate and module names
      const enrichedFeedback: FeedbackWithDetails[] = (data || []).map(feedback => {
        const candidate = candidatesWithClasses.find(c => c.id === feedback.candidate_id)
        const module = modules.find(m => m.id === feedback.module_id)
        
        return {
          ...feedback,
          candidate_name: candidate?.name || 'Unknown Candidate',
          module_name: module?.name || (feedback.module_id === 'outside-class' ? 'Outside Class' : 'Unknown Module')
        }
      })

      setAllFeedback(enrichedFeedback)
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback = allFeedback.filter(feedback => {
    const matchesSearch = 
      feedback.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCandidate = selectedCandidate === 'all' || feedback.candidate_id === selectedCandidate
    const matchesModule = selectedModule === 'all' || feedback.module_id === selectedModule
    const matchesType = selectedType === 'all' || feedback.feedback_type === selectedType

    return matchesSearch && matchesCandidate && matchesModule && matchesType
  })

  const getStats = () => {
    const total = filteredFeedback.length
    const positive = filteredFeedback.filter(f => f.feedback_type === 'good').length
    const needsImprovement = filteredFeedback.filter(f => f.feedback_type === 'bad').length
    const observational = filteredFeedback.filter(f => f.feedback_type === 'observational').length
    const uniqueCandidates = new Set(filteredFeedback.map(f => f.candidate_id)).size
    const uniqueAuthors = new Set(filteredFeedback.map(f => f.author)).size

    return { total, positive, needsImprovement, observational, uniqueCandidates, uniqueAuthors }
  }

  const stats = getStats()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'bad': return 'bg-red-100 text-red-800 border-red-200'
      case 'observational': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFeedbackTypeName = (type: string) => {
    switch (type) {
      case 'good': return 'Positive'
      case 'bad': return 'Needs Improvement'
      case 'observational': return 'Observational'
      default: return type
    }
  }

  const getSessionTypeName = (sessionType: string) => {
    switch (sessionType) {
      case 'lecture': return 'Lecture'
      case 'social': return 'Social Hour'
      case 'dexconnect': return 'DexConnect Meetup'
      case 'retraining': return 'Retraining Program'
      default: return sessionType
    }
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
                  <h1 className="text-2xl font-bold text-white">All Feedback</h1>
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
                    Comprehensive Feedback Collection
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-purple-300">Total Feedback Entries</div>
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
              { icon: MessageSquare, label: 'Total Feedback', value: stats.total, color: 'purple' },
              { icon: TrendingUp, label: 'Positive', value: stats.positive, color: 'green' },
              { icon: TrendingUp, label: 'Needs Improvement', value: stats.needsImprovement, color: 'red' },
              { icon: MessageSquare, label: 'Observational', value: stats.observational, color: 'yellow' },
              { icon: User, label: 'Candidates', value: stats.uniqueCandidates, color: 'blue' },
              { icon: User, label: 'Contributors', value: stats.uniqueAuthors, color: 'indigo' }
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
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                />
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
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Modules</option>
                <option value="outside-class">Outside Class</option>
                {modules.sort((a, b) => a.name.localeCompare(b.name)).map(module => (
                  <option key={module.id} value={module.id}>{module.name}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Types</option>
                <option value="good">Positive</option>
                <option value="bad">Needs Improvement</option>
                <option value="observational">Observational</option>
              </select>

              <div className="flex items-center justify-center">
                <span className="text-purple-300 font-semibold">
                  {filteredFeedback.length} results
                </span>
              </div>
            </div>
          </motion.div>

          {/* Feedback List */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              All Feedback ({filteredFeedback.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <motion.div 
                  className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-6 text-purple-400/50" />
                <p className="text-gray-400 text-lg">No feedback found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredFeedback.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{feedback.candidate_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{feedback.module_name}</span>
                              <span>•</span>
                              <span>{getSessionTypeName(feedback.session_type)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getFeedbackTypeColor(feedback.feedback_type)}`}>
                            {getFeedbackTypeName(feedback.feedback_type)}
                          </span>
                          <span className="text-sm text-gray-400">{formatDate(feedback.created_at)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-200 leading-relaxed mb-4">{feedback.feedback_text}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300">by {feedback.author}</span>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(feedback.created_at)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </VanguardScene>
  )
}