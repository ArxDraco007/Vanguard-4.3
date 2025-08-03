import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, FileText, Download, Play, Eye, Users, Target, Heart, Brain, Clock, Sparkles, Calendar, ExternalLink, Upload, Plus, Trash2, Edit3 } from 'lucide-react'
import { VanguardScene } from './3D/VanguardScene'
import { modules } from '../data/modules'
import { supabase } from '../lib/supabase'

interface DocumentModule {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  documents: Document[]
}

interface Document {
  id: string
  title: string
  type: 'presentation' | 'document' | 'video' | 'other'
  description: string
  fileUrl: string
  uploadedBy: string
  createdAt: string
}

interface UploadDocument {
  moduleId: string
  title: string
  description: string
  fileUrl: string
  type: string
  uploadedBy: string
}

const moduleIcons = {
  'ethics': Target,
  'empathy': Heart,
  'communication': Users,
  'thinking': Brain,
  'creativity-innovation': Sparkles,
  'the-grand-spectrum': Eye
}

const moduleColors = {
  'ethics': 'red',
  'empathy': 'pink',
  'communication': 'blue',
  'thinking': 'indigo',
  'creativity-innovation': 'purple',
  'the-grand-spectrum': 'yellow'
}

export const DocumentationPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId?: string }>()
  const [selectedModule, setSelectedModule] = useState<string | null>(moduleId || null)
  const [documents, setDocuments] = useState<Record<string, Document[]>>({})
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState<UploadDocument>({
    moduleId: '',
    title: '',
    description: '',
    fileUrl: '',
    type: 'document',
    uploadedBy: ''
  })

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group documents by module
      const groupedDocs: Record<string, Document[]> = {}
      data?.forEach(doc => {
        if (!groupedDocs[doc.module_id]) {
          groupedDocs[doc.module_id] = []
        }
        groupedDocs[doc.module_id].push({
          id: doc.id,
          title: doc.title,
          type: doc.file_type as any,
          description: doc.description,
          fileUrl: doc.file_url,
          uploadedBy: doc.uploaded_by,
          createdAt: doc.created_at
        })
      })

      setDocuments(groupedDocs)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadDocument = async () => {
    if (!uploadForm.title || !uploadForm.fileUrl || !uploadForm.moduleId || !uploadForm.uploadedBy) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const { error } = await supabase
        .from('documents')
        .insert([{
          module_id: uploadForm.moduleId,
          title: uploadForm.title,
          description: uploadForm.description,
          file_url: uploadForm.fileUrl,
          file_type: uploadForm.type,
          uploaded_by: uploadForm.uploadedBy
        }])

      if (error) throw error

      await fetchDocuments()
      setShowUploadModal(false)
      setUploadForm({
        moduleId: '',
        title: '',
        description: '',
        fileUrl: '',
        type: 'document',
        uploadedBy: ''
      })
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document')
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)

      if (error) throw error
      await fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, any> = {
      red: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', hover: 'hover:bg-red-500/30' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', hover: 'hover:bg-blue-500/30' },
      green: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', hover: 'hover:bg-green-500/30' },
      yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', hover: 'hover:bg-yellow-500/30' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', hover: 'hover:bg-purple-500/30' },
      pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-400', hover: 'hover:bg-pink-500/30' },
      indigo: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-400', hover: 'hover:bg-indigo-500/30' }
    }
    return colorMap[color] || colorMap.red
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation': return BookOpen
      case 'video': return Play
      case 'document': return FileText
      default: return FileText
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'video': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'document': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule)
    const moduleDocuments = documents[selectedModule] || []
    const color = moduleColors[selectedModule as keyof typeof moduleColors] || 'red'
    const colors = getColorClasses(color)
    const IconComponent = moduleIcons[selectedModule as keyof typeof moduleIcons] || Target
    
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
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                  <span className="font-semibold">Back to Documentation</span>
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setUploadForm({ ...uploadForm, moduleId: selectedModule })
                      setShowUploadModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors border border-blue-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                  <div className={`w-10 h-10 ${colors.bg} backdrop-blur-sm rounded-full flex items-center justify-center border ${colors.border}`}>
                    <IconComponent className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg">{module?.name}</div>
                    <div className="text-sm text-gray-300">Module Documentation</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Module Overview */}
            <motion.div 
              className={`${colors.bg} backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${colors.border} mb-12`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-6 mb-6">
                <div className={`w-20 h-20 ${colors.bg} backdrop-blur-sm rounded-3xl flex items-center justify-center border ${colors.border}`}>
                  <IconComponent className={`w-10 h-10 ${colors.text}`} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{module?.name}</h1>
                  <p className="text-gray-300 text-lg">{module?.type}</p>
                </div>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-400" />
                Documents & Materials ({moduleDocuments.length})
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <motion.div 
                    className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : moduleDocuments.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto mb-6 text-gray-400/50" />
                  <p className="text-gray-400 text-lg mb-8">No documents uploaded yet</p>
                  <button
                    onClick={() => {
                      setUploadForm({ ...uploadForm, moduleId: selectedModule })
                      setShowUploadModal(true)
                    }}
                    className="px-8 py-4 bg-blue-600/80 text-white rounded-2xl hover:bg-blue-500/80 transition-colors border border-blue-500/30"
                  >
                    Upload First Document
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {moduleDocuments.map((doc, index) => {
                    const DocIcon = getDocumentTypeIcon(doc.type)
                    return (
                      <motion.div
                        key={doc.id}
                        className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-600/30 hover:border-red-500/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${getDocumentTypeColor(doc.type)} backdrop-blur-sm rounded-2xl flex items-center justify-center border`}>
                              <DocIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{doc.title}</h3>
                              <p className="text-gray-300 mb-2">{doc.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium border ${getDocumentTypeColor(doc.type)}`}>
                                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                                </span>
                                <span className="text-gray-400">by {doc.uploadedBy}</span>
                                <span className="text-gray-400">{formatDate(doc.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors border border-blue-500/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </VanguardScene>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  const convertToDirectDownloadLink = (driveUrl: string) => {
    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
    }
    return driveUrl
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
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
              <Link to="/" className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-300 group">
                <motion.div
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold">Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="font-bold text-white text-lg">Documentation</span>
                  <div className="text-sm text-blue-300">Program Materials & Resources</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-10 h-10 text-blue-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Documentation</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive program materials, presentations, and resources for the Vanguard leadership development journey.
            </p>
          </motion.div>

          {/* Core Program Section */}
          <motion.div 
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-12 flex items-center gap-4"
              variants={itemVariants}
            >
              <Target className="w-10 h-10 text-red-400" />
              Core Program
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => {
                const color = moduleColors[module.id as keyof typeof moduleColors] || 'red'
                const colors = getColorClasses(color)
                const IconComponent = moduleIcons[module.id as keyof typeof moduleIcons] || Target
                const moduleDocuments = documents[module.id] || []
                return (
                  <motion.button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`${colors.bg} backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${colors.border} ${colors.hover} transition-all duration-300 text-left w-full`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-16 h-16 ${colors.bg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border ${colors.border}`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{module.name}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{module.type}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${colors.text} font-semibold bg-black/20 px-3 py-1 rounded-full border border-gray-600/30`}>
                        {moduleDocuments.length} documents
                      </span>
                      <motion.div
                        className={`w-6 h-6 ${colors.text} opacity-70`}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Upload Document Modal */}
        <AnimatePresence>
          {showUploadModal && (
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
                <h3 className="text-2xl font-bold text-white mb-6">Upload Document</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Module</label>
                    <select
                      value={uploadForm.moduleId}
                      onChange={(e) => setUploadForm({...uploadForm, moduleId: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="">Select Module</option>
                      {modules.map(module => (
                        <option key={module.id} value={module.id}>{module.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Document title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50 resize-none"
                      rows={3}
                      placeholder="Brief description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">File URL</label>
                    <input
                      type="url"
                      value={uploadForm.fileUrl}
                      onChange={(e) => setUploadForm({...uploadForm, fileUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Type</label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="document">Document</option>
                      <option value="presentation">Presentation</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={uploadForm.uploadedBy}
                      onChange={(e) => setUploadForm({...uploadForm, uploadedBy: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-600/30 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadDocument}
                    className="flex-1 px-4 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors"
                  >
                    Upload
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