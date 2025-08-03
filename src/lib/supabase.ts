import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password: string
          full_name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          full_name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          full_name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback_ratings: {
        Row: {
          id: string
          candidate_id: string
          reviewer_id: string
          reviewer_type: string
          rating: number
          comments: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          reviewer_id: string
          reviewer_type: string
          rating: number
          comments?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          reviewer_id?: string
          reviewer_type?: string
          rating?: number
          comments?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          name: string
          description: string
          checklist: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          checklist?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          checklist?: any
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string
          file_url: string
          file_type: string
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string
          file_url: string
          file_type?: string
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string
          file_url?: string
          file_type?: string
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          candidate_id: string
          module_id: string
          session_type: string
          feedback_text: string
          feedback_type: string
          author: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          module_id: string
          session_type: string
          feedback_text: string
          feedback_type: string
          author?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          module_id?: string
          session_type?: string
          feedback_text?: string
          feedback_type?: string
          author?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}