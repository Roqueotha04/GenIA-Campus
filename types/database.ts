export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ForeignKey<Column extends string, Relation extends string> = {
  foreignKeyName: `${string}_${Column}_fkey`;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Relation;
  referencedColumns: ["id"];
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: Database["public"]["Enums"]["user_role"];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: Database["public"]["Enums"]["user_role"];
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          level_slug: string;
          module_number: number;
          title: string;
          description: string;
          enrollment_key: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          level_slug: string;
          module_number: number;
          title: string;
          description?: string;
          enrollment_key?: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      course_teachers: {
        Row: { course_id: string; teacher_id: string; assigned_at: string };
        Insert: { course_id: string; teacher_id: string; assigned_at?: string };
        Update: Partial<Database["public"]["Tables"]["course_teachers"]["Insert"]>;
        Relationships: [
          ForeignKey<"course_id", "courses">,
          ForeignKey<"teacher_id", "profiles">,
        ];
      };
      enrollments: {
        Row: { course_id: string; student_id: string; enrolled_at: string };
        Insert: { course_id: string; student_id: string; enrolled_at?: string };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
        Relationships: [
          ForeignKey<"course_id", "courses">,
          ForeignKey<"student_id", "profiles">,
        ];
      };
      sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sections"]["Insert"]>;
        Relationships: [ForeignKey<"course_id", "courses">];
      };
      resources: {
        Row: {
          id: string;
          section_id: string;
          course_id: string;
          kind: Database["public"]["Enums"]["resource_kind"];
          title: string;
          storage_path: string | null;
          url: string | null;
          game_slug: string | null;
          quiz_id: string | null;
          assignment_id: string | null;
          forum_id: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          position: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          course_id?: string;
          kind: Database["public"]["Enums"]["resource_kind"];
          title: string;
          storage_path?: string | null;
          url?: string | null;
          game_slug?: string | null;
          quiz_id?: string | null;
          assignment_id?: string | null;
          forum_id?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          position?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
        Relationships: [
          ForeignKey<"section_id", "sections">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"quiz_id", "quizzes">,
          ForeignKey<"assignment_id", "assignments">,
          ForeignKey<"forum_id", "forums">,
          ForeignKey<"created_by", "profiles">,
        ];
      };
      assignments: {
        Row: {
          id: string;
          section_id: string;
          course_id: string;
          title: string;
          instructions: string;
          attachment_path: string | null;
          attachment_name: string | null;
          due_at: string | null;
          max_grade: number;
          cutoff_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          course_id?: string;
          title: string;
          instructions?: string;
          attachment_path?: string | null;
          attachment_name?: string | null;
          due_at?: string | null;
          max_grade?: number;
          cutoff_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Insert"]>;
        Relationships: [
          ForeignKey<"section_id", "sections">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"created_by", "profiles">,
        ];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          course_id: string;
          student_id: string;
          text_answer: string | null;
          link_url: string | null;
          file_path: string | null;
          file_name: string | null;
          submitted_at: string;
          grade: number | null;
          feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          course_id?: string;
          student_id?: string;
          text_answer?: string | null;
          link_url?: string | null;
          file_path?: string | null;
          file_name?: string | null;
          submitted_at?: string;
          grade?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["submissions"]["Insert"]>;
        Relationships: [
          ForeignKey<"assignment_id", "assignments">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"student_id", "profiles">,
        ];
      };
      notices: {
        Row: {
          id: string;
          course_id: string;
          author_id: string | null;
          title: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          author_id?: string | null;
          title: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notices"]["Insert"]>;
        Relationships: [
          ForeignKey<"course_id", "courses">,
          ForeignKey<"author_id", "profiles">,
        ];
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          passing_score: number;
          questions: Json;
          is_published: boolean;
          section_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string;
          passing_score?: number;
          questions?: Json;
          is_published?: boolean;
          section_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
        Relationships: [ForeignKey<"course_id", "courses">, ForeignKey<"section_id", "sections">];
      };
      forums: {
        Row: {
          id: string;
          section_id: string;
          course_id: string;
          title: string;
          intro: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          course_id?: string;
          title: string;
          intro?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["forums"]["Insert"]>;
        Relationships: [
          ForeignKey<"section_id", "sections">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"created_by", "profiles">,
        ];
      };
      forum_topics: {
        Row: {
          id: string;
          forum_id: string;
          course_id: string;
          author_id: string | null;
          author_name: string;
          title: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          forum_id: string;
          course_id?: string;
          author_id?: string | null;
          author_name?: string;
          title: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_topics"]["Insert"]>;
        Relationships: [
          ForeignKey<"forum_id", "forums">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"author_id", "profiles">,
        ];
      };
      forum_posts: {
        Row: {
          id: string;
          topic_id: string;
          course_id: string;
          author_id: string | null;
          author_name: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          course_id?: string;
          author_id?: string | null;
          author_name?: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["forum_posts"]["Insert"]>;
        Relationships: [
          ForeignKey<"topic_id", "forum_topics">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"author_id", "profiles">,
        ];
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          course_id: string;
          student_id: string;
          answers: Json;
          score: number;
          total: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          course_id: string;
          student_id: string;
          answers: Json;
          score: number;
          total: number;
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_attempts"]["Insert"]>;
        Relationships: [
          ForeignKey<"quiz_id", "quizzes">,
          ForeignKey<"course_id", "courses">,
          ForeignKey<"student_id", "profiles">,
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      teaches: { Args: { target_course_id: string }; Returns: boolean };
      is_enrolled: { Args: { target_course_id: string }; Returns: boolean };
      can_manage_course: { Args: { target_course_id: string }; Returns: boolean };
      can_view_course: { Args: { target_course_id: string }; Returns: boolean };
      enroll_with_key: {
        Args: { target_course_id: string; submitted_key: string };
        Returns: boolean;
      };
      course_enrollment_key: { Args: { target_course_id: string }; Returns: string };
      regenerate_enrollment_key: { Args: { target_course_id: string }; Returns: string };
    };
    Enums: {
      user_role: "admin" | "docente" | "alumno";
      resource_kind: "file" | "link" | "game" | "quiz" | "assignment" | "forum";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type TableRow<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Row"];

export type TableInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"];

export type UserRole = PublicSchema["Enums"]["user_role"];
export type ResourceKind = PublicSchema["Enums"]["resource_kind"];
