import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Edit3, Trash2, User, GraduationCap, Home, Shield, Search } from 'lucide-react'
import { VanguardScene } from './3D/VanguardScene'
import { getAllUsers, createUser, updateUser, deleteUser } from '../utils/auth'
import { User as UserType } from '../types/auth'

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'teacher' as 'teacher' | 'dorm_parent'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const fetchedUsers = await getAllUsers()
    setUsers(fetchedUsers)
    setLoading(false)
  }

  const handleAddUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.full_name.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const createdUser = await createUser(newUser)
      if (createdUser) {
        await fetchUsers()
        setNewUser({ username: '', password: '', full_name: '', role: 'teacher' })
        setShowAddUser(false)
      } else {
        alert('Failed to add user - username might already exist')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Failed to add user')
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const updatedUser = await updateUser(editingUser.id, editingUser)
      if (updatedUser) {
        await fetchUsers()
        setEditingUser(null)
      } else {
        alert('Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const success = await deleteUser(userId)
      if (success) {
        await fetchUsers()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole

    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return GraduationCap
      case 'dorm_parent': return Home
      default: return User
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'dorm_parent': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'teacher': return 'Teacher'
      case 'dorm_parent': return 'Dorm Parent'
      default: return role
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">User Management</h1>
                  <p className="text-xs text-blue-300 uppercase tracking-wider font-semibold">
                    Admin Panel • {users.length} Users
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Add User
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teachers</option>
                <option value="dorm_parent">Dorm Parents</option>
              </select>
            </div>
          </motion.div>

          {/* Users Grid */}
          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              System Users ({filteredUsers.length})
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <motion.div 
                  className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredUsers.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role)
                    return (
                      <motion.div
                        key={user.id}
                        className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <RoleIcon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1 hover:bg-blue-500/20 rounded text-blue-400"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 hover:bg-red-500/20 rounded text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-white mb-2">{user.full_name}</h3>
                        <p className="text-gray-400 text-sm mb-3">@{user.username}</p>
                        
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                          <RoleIcon className="w-4 h-4" />
                          {getRoleName(user.role)}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddUser && (
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
                <h3 className="text-2xl font-bold text-white mb-6">Add New User</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'teacher' | 'dorm_parent'})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="teacher">Teacher</option>
                      <option value="dorm_parent">Dorm Parent</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 px-4 py-3 border border-gray-600/30 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-4 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {editingUser && (
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
                <h3 className="text-2xl font-bold text-white mb-6">Edit User</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editingUser.full_name}
                      onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={editingUser.password}
                      onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'teacher' | 'dorm_parent'})}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="teacher">Teacher</option>
                      <option value="dorm_parent">Dorm Parent</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-3 border border-gray-600/30 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 px-4 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-500/80 transition-colors"
                  >
                    Update User
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