export interface User {
  id: string
  username: string
  password: string
  role: 'admin' | 'teacher' | 'dorm_parent'
  full_name: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export interface FeedbackRating {
  id: string
  candidate_id: string
  reviewer_id: string
  reviewer_type: 'teacher' | 'dorm_parent'
  rating: number // 1-10
  comments: string
  created_at: string
  updated_at: string
}