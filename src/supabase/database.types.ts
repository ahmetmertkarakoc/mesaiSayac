export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          is_master: boolean
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          is_master?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          is_master?: boolean
        }
      }
      work_hours: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          hours: number
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          hours: number
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          hours?: number
          description?: string | null
        }
      }
    }
  }
}