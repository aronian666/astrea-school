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
      areas: {
        Row: {
          id: number
          name: string
          short_name: string | null
        }
        Insert: {
          id?: number
          name: string
          short_name?: string | null
        }
        Update: {
          id?: number
          name?: string
          short_name?: string | null
        }
        Relationships: []
      }
      carts: {
        Row: {
          class_person_id: number
          concept_id: number
          created_at: string
          date: unknown | null
          discount_id: number | null
          finish: string | null
          id: number
          last_date: string | null
          middle_date: string | null
          start: string | null
        }
        Insert: {
          class_person_id: number
          concept_id: number
          created_at?: string
          date?: unknown | null
          discount_id?: number | null
          finish?: string | null
          id?: number
          last_date?: string | null
          middle_date?: string | null
          start?: string | null
        }
        Update: {
          class_person_id?: number
          concept_id?: number
          created_at?: string
          date?: unknown | null
          discount_id?: number | null
          finish?: string | null
          id?: number
          last_date?: string | null
          middle_date?: string | null
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_carts_class_person_id_fkey"
            columns: ["class_person_id"]
            isOneToOne: false
            referencedRelation: "class_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_carts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_carts_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      class_courses: {
        Row: {
          class_id: number
          course_id: number
          person_dni: string | null
        }
        Insert: {
          class_id: number
          course_id: number
          person_dni?: string | null
        }
        Update: {
          class_id?: number
          course_id?: number
          person_dni?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_courses_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_courses_person_dni_fkey"
            columns: ["person_dni"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["dni"]
          },
        ]
      }
      class_person_s: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      class_persons: {
        Row: {
          class_id: number
          created_at: string
          id: number
          person_id: number
          search: unknown | null
          status: Database["public"]["Enums"]["class_person_status"]
          status_id: number
        }
        Insert: {
          class_id: number
          created_at?: string
          id?: number
          person_id: number
          search?: unknown | null
          status?: Database["public"]["Enums"]["class_person_status"]
          status_id?: number
        }
        Update: {
          class_id?: number
          created_at?: string
          id?: number
          person_id?: number
          search?: unknown | null
          status?: Database["public"]["Enums"]["class_person_status"]
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_persons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_persons_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_class_persons_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "class_person_s"
            referencedColumns: ["id"]
          },
        ]
      }
      class_students: {
        Row: {
          class_id: number
          student_id: number
        }
        Insert: {
          class_id: number
          student_id: number
        }
        Update: {
          class_id?: number
          student_id?: number
        }
        Relationships: []
      }
      classes: {
        Row: {
          area_id: number
          created_at: string
          id: number
          level_id: number
          season_id: number
          section_id: number
        }
        Insert: {
          area_id: number
          created_at?: string
          id?: number
          level_id: number
          season_id: number
          section_id: number
        }
        Update: {
          area_id?: number
          created_at?: string
          id?: number
          level_id?: number
          season_id?: number
          section_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "classes_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_level_id_area_id_fkey"
            columns: ["level_id", "area_id"]
            isOneToOne: false
            referencedRelation: "level_areas"
            referencedColumns: ["level_id", "area_id"]
          },
          {
            foreignKeyName: "classes_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      competences: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      concepts: {
        Row: {
          func: string | null
          id: number
          name: string
          season_id: number
          serial: boolean
          starting: boolean
          value: number
        }
        Insert: {
          func?: string | null
          id?: number
          name: string
          season_id?: number
          serial?: boolean
          starting?: boolean
          value?: number
        }
        Update: {
          func?: string | null
          id?: number
          name?: string
          season_id?: number
          serial?: boolean
          starting?: boolean
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "concepts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_competences: {
        Row: {
          competence_id: number
          course_id: number
        }
        Insert: {
          competence_id: number
          course_id: number
        }
        Update: {
          competence_id?: number
          course_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_competences_competence_id_fkey"
            columns: ["competence_id"]
            isOneToOne: false
            referencedRelation: "competences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_competences_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_id: number | null
          id: number
          name: string
          order: number | null
        }
        Insert: {
          course_id?: number | null
          id?: number
          name: string
          order?: number | null
        }
        Update: {
          course_id?: number | null
          id?: number
          name?: string
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      cycles: {
        Row: {
          created_at: string
          end_date: string
          id: number
          name: string
          season_id: number
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          name: string
          season_id: number
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          name?: string
          season_id?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "Cycles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          concept_id: number
          id: number
          name: string
          value: number
        }
        Insert: {
          concept_id: number
          id?: number
          name: string
          value: number
        }
        Update: {
          concept_id?: number
          id?: number
          name?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "discounts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      level_areas: {
        Row: {
          area_id: number
          level_id: number
        }
        Insert: {
          area_id: number
          level_id: number
        }
        Update: {
          area_id?: number
          level_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "level_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "level_areas_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          grades: number[]
          icon: string
          id: number
          name: string
        }
        Insert: {
          grades?: number[]
          icon?: string
          id?: number
          name: string
        }
        Update: {
          grades?: number[]
          icon?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      methods: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          class_person_id: number
          created_at: string
          id: number
          method_id: number
          person_id: number
          season_id: number
          total_value: number
          user_id: string
        }
        Insert: {
          class_person_id: number
          created_at?: string
          id?: number
          method_id?: number
          person_id: number
          season_id?: number
          total_value?: number
          user_id: string
        }
        Update: {
          class_person_id?: number
          created_at?: string
          id?: number
          method_id?: number
          person_id?: number
          season_id?: number
          total_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_orders_class_person_id_fkey"
            columns: ["class_person_id"]
            isOneToOne: false
            referencedRelation: "class_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_orders_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_orders_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          class_person_id: number | null
          concept_id: number
          created_at: string
          date: unknown | null
          discount_id: number | null
          final_value: number
          finish: string | null
          id: number
          middle_date: string | null
          order_id: number
          penalty: number
          percent: number
          start: string | null
          value: number
        }
        Insert: {
          class_person_id?: number | null
          concept_id: number
          created_at?: string
          date?: unknown | null
          discount_id?: number | null
          final_value?: number
          finish?: string | null
          id?: number
          middle_date?: string | null
          order_id: number
          penalty?: number
          percent?: number
          start?: string | null
          value: number
        }
        Update: {
          class_person_id?: number | null
          concept_id?: number
          created_at?: string
          date?: unknown | null
          discount_id?: number | null
          final_value?: number
          finish?: string | null
          id?: number
          middle_date?: string | null
          order_id?: number
          penalty?: number
          percent?: number
          start?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      penalties: {
        Row: {
          concept_id: number
          func: string
          id: number
          name: string
        }
        Insert: {
          concept_id: number
          func: string
          id?: number
          name: string
        }
        Update: {
          concept_id?: number
          func?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "penalties_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      persons: {
        Row: {
          address: string | null
          birthday: string | null
          cellphone: string | null
          created_at: string
          dni: string
          first_name: string
          full_name: string | null
          id: number
          last_name1: string
          last_name2: string
          search: string | null
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          cellphone?: string | null
          created_at?: string
          dni: string
          first_name: string
          full_name?: string | null
          id?: number
          last_name1: string
          last_name2: string
          search?: string | null
        }
        Update: {
          address?: string | null
          birthday?: string | null
          cellphone?: string | null
          created_at?: string
          dni?: string
          first_name?: string
          full_name?: string | null
          id?: number
          last_name1?: string
          last_name2?: string
          search?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          class_person_id: number
          competence_id: number
          course_id: number
          created_at: string | null
          cycle_id: number
          value: number
        }
        Insert: {
          class_person_id: number
          competence_id: number
          course_id: number
          created_at?: string | null
          cycle_id: number
          value: number
        }
        Update: {
          class_person_id?: number
          competence_id?: number
          course_id?: number
          created_at?: string | null
          cycle_id?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_class_person_id_fkey"
            columns: ["class_person_id"]
            isOneToOne: false
            referencedRelation: "class_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_competence_id_fkey"
            columns: ["competence_id"]
            isOneToOne: false
            referencedRelation: "competences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      school_users: {
        Row: {
          role_id: number
          school_id: number
          user_id: string
        }
        Insert: {
          role_id: number
          school_id: number
          user_id: string
        }
        Update: {
          role_id?: number
          school_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string
          created_at: string
          id: number
          logo: string
          name: string
          ruc: string
          user_id: string | null
        }
        Insert: {
          address?: string
          created_at?: string
          id?: number
          logo?: string
          name: string
          ruc?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: number
          logo?: string
          name?: string
          ruc?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      season_course_competences: {
        Row: {
          competence_id: number
          season_course_id: number
        }
        Insert: {
          competence_id: number
          season_course_id: number
        }
        Update: {
          competence_id?: number
          season_course_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_course_competences_competence_id_fkey"
            columns: ["competence_id"]
            isOneToOne: false
            referencedRelation: "competences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_course_competences_season_level_course_id_fkey"
            columns: ["season_course_id"]
            isOneToOne: false
            referencedRelation: "season_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      season_courses: {
        Row: {
          course_id: number
          id: number
          level_id: number
          order: number | null
          season_id: number
        }
        Insert: {
          course_id: number
          id?: number
          level_id: number
          order?: number | null
          season_id: number
        }
        Update: {
          course_id?: number
          id?: number
          level_id?: number
          order?: number | null
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_level_courses_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_level_courses_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      season_persons: {
        Row: {
          created_at: string
          person_dni: string
          role_id: number
          season_id: number
        }
        Insert: {
          created_at?: string
          person_dni: string
          role_id: number
          season_id: number
        }
        Update: {
          created_at?: string
          person_dni?: string
          role_id?: number
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_persons_person_dni_fkey"
            columns: ["person_dni"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["dni"]
          },
          {
            foreignKeyName: "season_persons_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_persons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          end_at: string
          id: number
          name: string
          period: unknown
          school_id: number
          start_at: string
          user_id: string
        }
        Insert: {
          end_at?: string
          id?: number
          name: string
          period: unknown
          school_id: number
          start_at?: string
          user_id: string
        }
        Update: {
          end_at?: string
          id?: number
          name?: string
          period?: unknown
          school_id?: number
          start_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          id: number
          person_id: string
          season_id: number
          status: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          person_id: string
          season_id: number
          status?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          person_id?: string
          season_id?: number
          status?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "students_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["dni"]
          },
          {
            foreignKeyName: "students_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          area_id: number | null
          level_id: number | null
          message: string | null
        }
        Insert: {
          area_id?: number | null
          level_id?: number | null
          message?: string | null
        }
        Update: {
          area_id?: number | null
          level_id?: number | null
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_level_id_area_id_fkey"
            columns: ["level_id", "area_id"]
            isOneToOne: false
            referencedRelation: "level_areas"
            referencedColumns: ["level_id", "area_id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          name: string | null
          person_id: number | null
          picture: string | null
        }
        Insert: {
          email?: string | null
          id: string
          name?: string | null
          person_id?: number | null
          picture?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          name?: string | null
          person_id?: number | null
          picture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_carts: {
        Row: {
          class_person_id: number | null
          concept_id: number | null
          created_at: string | null
          date: unknown | null
          discount_id: number | null
          final_value: number | null
          finish: string | null
          id: number | null
          last_date: string | null
          middle_date: string | null
          penalty: number | null
          start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_carts_class_person_id_fkey"
            columns: ["class_person_id"]
            isOneToOne: false
            referencedRelation: "class_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_carts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_carts_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      gbt_bit_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      get_class_person_id: {
        Args: {
          order_id: number
        }
        Returns: number
      }
      get_class_persons_search: {
        Args: {
          person_id: number
        }
        Returns: unknown
      }
      get_concept: {
        Args: {
          concept_id: number
        }
        Returns: number
      }
      get_discount: {
        Args: {
          discount_id: number
        }
        Returns: number
      }
      run_query: {
        Args: {
          query: string
        }
        Returns: Json[]
      }
    }
    Enums: {
      class_person_status: "activo" | "suspendido" | "retirado"
      kin: "padre" | "madre" | "apoderado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
