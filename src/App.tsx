import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProfessionalAuthGate } from './components/ProfessionalAuthGate'
import { EnhancedHomePage } from './components/EnhancedHomePage'
import { AboutPage } from './components/AboutPage'
import { VisionPage } from './components/VisionPage'
import { ProgramsPage } from './components/ProgramsPage'
import { DocumentationPage } from './components/DocumentationPage'
import { EnhancedCandidateSelection } from './components/EnhancedCandidateSelection'
import { EnhancedClassTypeSelection } from './components/EnhancedClassTypeSelection'
import { EnhancedFeedbackOverview } from './components/EnhancedFeedbackOverview'
import { CandidateManagement } from './components/CandidateManagement'
import { SessionsPage } from './components/SessionsPage'
import { AllFeedbackPage } from './components/AllFeedbackPage'
import { UserManagement } from './components/UserManagement'
import { TeacherFeedbackSystem } from './components/TeacherFeedbackSystem'
import { AdminFeedbackAnalytics } from './components/AdminFeedbackAnalytics'
import { User } from './types/auth'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  if (!currentUser) {
    return (
      <ProfessionalAuthGate onAuthenticated={(user) => setCurrentUser(user)}>
        <div />
      </ProfessionalAuthGate>
    )
  }

  // Role-based routing
  if (currentUser.role === 'teacher' || currentUser.role === 'dorm_parent') {
    return <TeacherFeedbackSystem currentUser={currentUser} />
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedHomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/documentation/:moduleId" element={<DocumentationPage />} />
        <Route path="/manage-candidates" element={<CandidateManagement />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/manage-users" element={<UserManagement />} />
        <Route path="/all-feedback" element={<AllFeedbackPage />} />
        <Route path="/candidates" element={<EnhancedCandidateSelection />} />
        <Route path="/feedback-analytics" element={<AdminFeedbackAnalytics />} />
        <Route path="/candidate/:candidateId/class-type" element={<EnhancedClassTypeSelection />} />
        <Route path="/candidate/:candidateId/feedback/:moduleId/:sessionType" element={<EnhancedFeedbackOverview />} />
      </Routes>
    </Router>
  )
}

  // Admin routes
export default App