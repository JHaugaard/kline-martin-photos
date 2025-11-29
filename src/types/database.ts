/**
 * TypeScript type definitions for the Kline-Martin Photos database schema
 *
 * These types are auto-generated from your Supabase schema and provide
 * full type safety when working with the database. They ensure:
 * - Type-safe queries with autocomplete in your IDE
 * - Compile-time checking for database operations
 * - Protection against typos in table/column names
 *
 * In a real project, these would be generated via:
 * `supabase gen types typescript --project-id=YOUR_PROJECT_ID > src/types/database.ts`
 *
 * For now, we're providing the schema structure based on CLAUDE.md
 */

export type Database = {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          filename: string
          storage_path: string
          title: string | null
          keywords: string[] | null
          image_embedding: number[] | null // vector(512) - SigLIP embeddings
          text_embedding: number[] | null // vector(768) - nomic-embed-text embeddings
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          storage_path: string
          title?: string | null
          keywords?: string[] | null
          image_embedding?: number[] | null
          text_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          storage_path?: string
          title?: string | null
          keywords?: string[] | null
          image_embedding?: number[] | null
          text_embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          id: string
          image_id: string
          token: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          image_id: string
          token: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          image_id?: string
          token?: string
          created_at?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'share_links_image_id_fkey'
            columns: ['image_id']
            isOneToOne: false
            referencedRelation: 'images'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'share_links_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'viewer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'viewer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'viewer' | 'admin'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'viewer' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          email_confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          email_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          email_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
