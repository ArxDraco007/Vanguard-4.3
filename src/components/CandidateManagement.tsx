import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, User, Users, Edit3, Trash2, GraduationCap, Calendar } from 'lucide-react'
import { VanguardScene } from './3D/VanguardScene'
import { classes, candidatesWithClasses, Class, Candidate } from '../data/classes'

export const CandidateManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [showAddClass, setShowAddClass] = useState(false)
  const [allClasses, setAllClasses] = useState<Class[]>(classes)
  const [allCandidates, setAllCandidates] = useState<Candidate[]>(candidatesWithClasses)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    title: 'Vanguard Candidate',
    class_id: 'class-2025'
  })

  const [newClass, setNewClass] = useState({
    name: '',
    year: new Date().getFullYear(),
    description: ''
  })

  const filteredCandidates = allCandidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = selectedClass === 'all' || candidate.class_id === selectedClass
      return matchesSearch && matchesClass
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleAddCandidate = () => {
    if (!newCandidate.name.trim()) return

    const candidate: Candidate = {
      id: newCandidate.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: newCandidate.name.toUpperCase(),
      title: newCandidate.title,
      class_id: newCandidate.class_id,
      created_at: new Date().toISOString()
    }

    setAllCandidates(prev => [...prev, candidate].sort((a, b) => a.name.localeCompare(b.name)))
    setNewCandidate({ name: '', title: 'Vanguard Candidate', class_id: 'class-2025' })
    setShowAddCandidate(false)
  }

  const handleAddClass = () => {
    if (!newClass.name.trim()) return

    const classObj: Class = {
      id: `class-${newClass.year}-${Date.now()}`,
      name: newClass.name,
      year: newClass.year,
      description: newClass.description,
      created_at: new Date().toISOString()
    }

    setAllClasses(prev => [...prev, classObj])
    setNewClass({ name: '', year: new Date().getFullYear(), description: '' })
    setShowAddClass(false)
  }

  const handleDeleteCandidate = (candidateId: string) => {
    setAllCandidates(prev => prev.filter(c => c.id !== candidateId))
  }

  const handleDeleteClass = (classId: string) => {
    // Don't delete if candidates exist in this class
    const candidatesInClass = allCandidates.filter(c => c.class_id === classId)
    if (candidatesInClass.length > 0) {
      alert(`Cannot delete class. ${candidatesInClass.length} candidates are assigned to this class.`)
      return
    }
    setAllClasses(prev => prev.filter(c => c.id !== classId))
  }

  const getClassById = (classId: string) => {
    return allClasses.find(c => c.id === classId)
  }

  const getCandidateCountByClass = (classId: string) => {
    return allCandidates.filter(c => c.class_id === classId).length
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 border border-red-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Candidate Management</h1>
                  <p className="text-xs text-red-300 uppercase tracking-wider font-semibold">
                    {allCandidates.length} Total Candidates • {allClasses.length} Classes
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowAddClass(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors border border-blue-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Add Class
                </motion.button>
                <motion.button
                  onClick={() => setShowAddCandidate(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/80 text-white rounded-xl hover:bg-red-500/80 transition-colors border border-red-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Candidate
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="all">All Classes</option>
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({getCandidateCountByClass(cls.id)})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Classes Overview */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              Classes Overview
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allClasses.map(cls => (
                <div key={cls.id} className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">{cls.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingClass(cls)}
                        className="p-1 hover:bg-blue-500/20 rounded text-blue-400"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-blue-300 text-sm mb-2">{cls.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400">{getCandidateCountByClass(cls.id)} candidates</span>
                    <span className="text-gray-400">{cls.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Candidates Grid */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-red-400" />
              Candidates ({filteredCandidates.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredCandidates.map((candidate, index) => {
                  const candidateClass = getClassById(candidate.class_id)
                  return (
                    <motion.div
                      key={candidate.id}
                      className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingCandidate(candidate)}
                            className="p-1 hover:bg-blue-500/20 rounded text-blue-400"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-white text-sm mb-2 leading-tight">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3">{candidate.title}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                          {candidateClass?.name || 'Unknown Class'}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Add Candidate Modal */}
        <AnimatePresence>
          {showAddCandidate && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-red-500/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Add New Candidate</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-red-500/50"
                      placeholder="Enter candidate name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={newCandidate.title}
                      onChange={(e) => setNewCandidate({...newCandidate, title: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Class</label>
                    <select
                      value={newCandidate.class_id}
                      onChange={(e) => setNewCandidate({...newCandidate, class_id: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-red-500/50"
                    >
                      {allClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddCandidate(false)}
                    className="flex-1 px-4 py-3 border border-gray-600/30 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCandidate}
                    className="flex-1 px-4 py-3 bg-red-600/80 text-white rounded-xl hover:bg-red-500/80 transition-colors"
                  >
                    Add Candidate
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Class Modal */}
        <AnimatePresence>
          {showAddClass && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-blue-500/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Add New Class</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Class Name</label>
                    <input
                      type="text"
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="e.g., Class of 2026"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                    <input
                      type="number"
                      value={newClass.year}
                      onChange={(e) => setNewClass({...newClass, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newClass.description}
                      onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50 resize-none"
                      rows={3}
                      placeholder="Brief description of the class"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddClass(false)}
                    className="flex-1 px-4 py-3 border border-gray-600/30 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddClass}
                    className="flex-1 px-4 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors"
                  >
                    Add Class
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