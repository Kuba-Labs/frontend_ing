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
      broadcasts: {
        Row: {
          broadcast_name: string
          id: number
          message_content: Json | null
          owner: number
          send_started: boolean
        }
        Insert: {
          broadcast_name: string
          id?: number
          message_content?: Json | null
          owner: number
          send_started?: boolean
        }
        Update: {
          broadcast_name?: string
          id?: number
          message_content?: Json | null
          owner?: number
          send_started?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "broadcasts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      broadcasts_contacts: {
        Row: {
          broadcast: number
          error_msg: string | null
          sent: boolean
          wa_id: number
        }
        Insert: {
          broadcast: number
          error_msg?: string | null
          sent?: boolean
          wa_id: number
        }
        Update: {
          broadcast?: number
          error_msg?: string | null
          sent?: boolean
          wa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_contacts_broadcast_fkey"
            columns: ["broadcast"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcasts_contacts_broadcast_fkey"
            columns: ["broadcast"]
            isOneToOne: false
            referencedRelation: "broadcasts_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcasts_contacts_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "broadcasts_contacts_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      contacts: {
        Row: {
          loginnnn: string | null
          name: string | null
          wa_id: number
        }
        Insert: {
          loginnnn?: string | null
          name?: string | null
          wa_id: number
        }
        Update: {
          loginnnn?: string | null
          name?: string | null
          wa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "contacts_loginnnn_fkey"
            columns: ["loginnnn"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ecom_setup: {
        Row: {
          admin: boolean
          ecom_id: string
          login: string | null
          owner: number | null
        }
        Insert: {
          admin?: boolean
          ecom_id: string
          login?: string | null
          owner?: number | null
        }
        Update: {
          admin?: boolean
          ecom_id?: string
          login?: string | null
          owner?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ecom_setup_owner_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "ecom_setup_owner_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      messages: {
        Row: {
          data: Json
          from: number
          handled: boolean
          status: string | null
          timestamp: string
          to: number
          type: string
          wam_id: string
        }
        Insert: {
          data: Json
          from: number
          handled?: boolean
          status?: string | null
          timestamp: string
          to: number
          type: string
          wam_id: string
        }
        Update: {
          data?: Json
          from?: number
          handled?: boolean
          status?: string | null
          timestamp?: string
          to?: number
          type?: string
          wam_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      officina_broadcast_serio: {
        Row: {
          consent: boolean
          name: string | null
          phone: number
          sent_first: boolean
        }
        Insert: {
          consent?: boolean
          name?: string | null
          phone: number
          sent_first?: boolean
        }
        Update: {
          consent?: boolean
          name?: string | null
          phone?: number
          sent_first?: boolean
        }
        Relationships: []
      }
      officina_broadcast_test: {
        Row: {
          consent: boolean
          name: string | null
          phone: number
          sent_first: boolean
        }
        Insert: {
          consent?: boolean
          name?: string | null
          phone: number
          sent_first?: boolean
        }
        Update: {
          consent?: boolean
          name?: string | null
          phone?: number
          sent_first?: boolean
        }
        Relationships: []
      }
      officina_iscrizioni: {
        Row: {
          category: string
          phone: number
        }
        Insert: {
          category: string
          phone: number
        }
        Update: {
          category?: string
          phone?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          carrier_code: number | null
          consent: boolean
          customer_number: number | null
          date_created: string
          date_shipped: string | null
          ecom_id: string
          ecom_order_id: string
          name: string
          retargeting_status: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_cost_cents: number | null
          tracking_code: string | null
          tracking_subscribed: boolean
        }
        Insert: {
          carrier_code?: number | null
          consent: boolean
          customer_number?: number | null
          date_created: string
          date_shipped?: string | null
          ecom_id: string
          ecom_order_id: string
          name: string
          retargeting_status?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cost_cents?: number | null
          tracking_code?: string | null
          tracking_subscribed?: boolean
        }
        Update: {
          carrier_code?: number | null
          consent?: boolean
          customer_number?: number | null
          date_created?: string
          date_shipped?: string | null
          ecom_id?: string
          ecom_order_id?: string
          name?: string
          retargeting_status?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cost_cents?: number | null
          tracking_code?: string | null
          tracking_subscribed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_number_fkey"
            columns: ["customer_number"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "orders_customer_number_fkey"
            columns: ["customer_number"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      orders_tracking_updates: {
        Row: {
          carrier_code: number
          date: string
          notified: boolean
          tracking_code: string
          update: string
        }
        Insert: {
          carrier_code: number
          date: string
          notified?: boolean
          tracking_code: string
          update: string
        }
        Update: {
          carrier_code?: number
          date?: string
          notified?: boolean
          tracking_code?: string
          update?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_tracking_updates_tracking_code_carrier_code_fkey"
            columns: ["tracking_code", "carrier_code"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["tracking_code", "carrier_code"]
          }
        ]
      }
      setup: {
        Row: {
          access_token_c: string
          app_secret_c: string
          business_account_id: string
          phone_id_c: string
          wa_id: number
        }
        Insert: {
          access_token_c: string
          app_secret_c?: string
          business_account_id: string
          phone_id_c: string
          wa_id?: number
        }
        Update: {
          access_token_c?: string
          app_secret_c?: string
          business_account_id?: string
          phone_id_c?: string
          wa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "setup_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: true
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "setup_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      tags: {
        Row: {
          ecom_wa_id: number
          tag: string
          wa_id: number
        }
        Insert: {
          ecom_wa_id: number
          tag: string
          wa_id: number
        }
        Update: {
          ecom_wa_id?: number
          tag?: string
          wa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tags_ecom_wa_id_fkey"
            columns: ["ecom_wa_id"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "tags_ecom_wa_id_fkey"
            columns: ["ecom_wa_id"]
            isOneToOne: false
            referencedRelation: "ecom_setup"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "tags_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "tags_wa_id_fkey"
            columns: ["wa_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      telegram_ids: {
        Row: {
          bot_username: string
          chat_id: number
          created_at: string | null
          id: number
        }
        Insert: {
          bot_username: string
          chat_id: number
          created_at?: string | null
          id?: number
        }
        Update: {
          bot_username?: string
          chat_id?: number
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      broadcasts_summary: {
        Row: {
          broadcast_name: string | null
          id: number | null
          message_content: Json | null
          missing: number | null
          owner: number | null
          send_started: boolean | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "broadcasts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      contact_msg_tags: {
        Row: {
          admin: boolean | null
          data: Json | null
          ecom_id: string | null
          from: number | null
          handled: boolean | null
          login: string | null
          loginnnn: string | null
          name: string | null
          owner: number | null
          replied: boolean | null
          status: string | null
          tags: string[] | null
          timestamp: string | null
          to: number | null
          type: string | null
          wa_id: number | null
          wam_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_loginnnn_fkey"
            columns: ["loginnnn"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecom_setup_owner_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "ecom_setup_owner_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["wa_id"]
          },
          {
            foreignKeyName: "messages_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["wa_id"]
          }
        ]
      }
      unique_tags: {
        Row: {
          ecom_wa_id: number | null
          tag: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_ecom_wa_id_fkey"
            columns: ["ecom_wa_id"]
            isOneToOne: false
            referencedRelation: "ecom_setup"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "tags_ecom_wa_id_fkey"
            columns: ["ecom_wa_id"]
            isOneToOne: false
            referencedRelation: "contact_msg_tags"
            referencedColumns: ["owner"]
          }
        ]
      }
    }
    Functions: {
      get_contacts: {
        Args: {
          to_number: number
          show_sent: boolean
        }
        Returns: {
          wa_id: number
          name: string
          last_message: string
        }[]
      }
      get_messages: {
        Args: {
          current_number: number
          chat_number: number
        }
        Returns: {
          wam_id: string
          from: number
          timestamp: string
          data: Json
          type: string
          to: number
          status: string
          handled: boolean
        }[]
      }
      get_wa_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status: "PROCESSING" | "SHIPPED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
