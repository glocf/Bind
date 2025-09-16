

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          id: string
          created_at: string
          user_id: string
          event_type: "profile_view" | "link_click"
          link_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          event_type: "profile_view" | "link_click"
          link_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          event_type?: "profile_view" | "link_click"
          link_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          }
        ]
      }
      links: {
        Row: {
          created_at: string
          id: string
          order: number
          title: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number
          title: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_image_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
          unlocked_badges: string[] | null
          equipped_badges: string[] | null
          profile_opacity: number | null
          profile_blur: number | null
          discord_presence: string | null
          background_effects: string | null
          location: string | null
          accent_color: string | null
          text_color: string | null
          background_color: string | null
          icon_color: string | null
          enable_profile_gradient: boolean | null
          monochrome_icons: boolean | null
          animated_title: boolean | null
          swap_box_colors: boolean | null
          volume_control: boolean | null
          use_discord_avatar: boolean | null
          discord_avatar_decoration: boolean | null
          email: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_image_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          unlocked_badges?: string[] | null
          equipped_badges?: string[] | null
          profile_opacity?: number | null
          profile_blur?: number | null
          discord_presence?: string | null
          background_effects?: string | null
          location?: string | null
          accent_color?: string | null
          text_color?: string | null
          background_color?: string | null
          icon_color?: string | null
          enable_profile_gradient?: boolean | null
          monochrome_icons?: boolean | null
          animated_title?: boolean | null
          swap_box_colors?: boolean | null
          volume_control?: boolean | null
          use_discord_avatar?: boolean | null
          discord_avatar_decoration?: boolean | null
          email?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_image_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          unlocked_badges?: string[] | null
          equipped_badges?: string[] | null
          profile_opacity?: number | null
          profile_blur?: number | null
          discord_presence?: string | null
          background_effects?: string | null
          location?: string | null
          accent_color?: string | null
          text_color?: string | null
          background_color?: string | null
          icon_color?: string | null
          enable_profile_gradient?: boolean | null
          monochrome_icons?: boolean | null
          animated_title?: boolean | null
          swap_box_colors?: boolean | null
          volume_control?: boolean | null
          use_discord_avatar?: boolean | null
          discord_avatar_decoration?: boolean | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Link = Database['public']['Tables']['links']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics']['Row'];

export type Factor = {
  id: string;
  friendly_name: string;
  factor_type: 'totp';
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
};
