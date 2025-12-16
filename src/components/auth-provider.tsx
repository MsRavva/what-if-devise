"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signInWithGoogle: () => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем, что Supabase настроен
    if (!supabase) {
      console.warn('Supabase не настроен, аутентификация недоступна')
      setLoading(false)
      return
    }

    // Получаем текущую сессию
    const getSession = async () => {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Ошибка получения сессии:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Слушаем изменения аутентификации
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase не настроен' } as AuthError }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data.user, error }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase не настроен' } as AuthError }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, error }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase не настроен' } as AuthError }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase не настроен' } as AuthError }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        return { user: null, error };
      }

      // В случае успешного OAuth входа, пользователь будет перенаправлен на Google для аутентификации
      // После аутентификации Google перенаправит обратно на приложение
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}