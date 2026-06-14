export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      quote_reports: {
        Row: {
          id: string;
          user_id: string | null;
          quote_text: string;
          repair_type: string | null;
          location: string | null;
          urgency: string | null;
          sensitive_items: string[];
          report: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          quote_text: string;
          repair_type?: string | null;
          location?: string | null;
          urgency?: string | null;
          sensitive_items?: string[];
          report: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          quote_text?: string;
          repair_type?: string | null;
          location?: string | null;
          urgency?: string | null;
          sensitive_items?: string[];
          report?: Json;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
