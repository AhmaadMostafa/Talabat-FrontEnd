import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { accountApi } from '@/lib/api'
import type { User, Address } from '@/types'
import { toast } from 'react-hot-toast'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { displayName: string; email: string; password: string }) => Promise<void>
  logout: () => void
  loadCurrentUser: () => Promise<void>
  getUserAddress: () => Promise<Address | null>
  updateUserAddress: (address: Address) => Promise<void>
  checkEmailExists: (email: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const user = await accountApi.login(credentials)
          localStorage.setItem('token', user.token)
          set({ user, isAuthenticated: true, isLoading: false })
          toast.success('Login successful!')
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const user = await accountApi.register(userData)
          localStorage.setItem('token', user.token)
          set({ user, isAuthenticated: true, isLoading: false })
          toast.success('Registration successful!')
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, isAuthenticated: false })
        toast.success('Logged out successfully')
      },

      loadCurrentUser: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
          set({ user: null, isAuthenticated: false })
          return
        }

        set({ isLoading: true })
        try {
          const user = await accountApi.getCurrentUser()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          localStorage.removeItem('token')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      getUserAddress: async () => {
        try {
          return await accountApi.getUserAddress()
        } catch (error) {
          console.error('Failed to get user address:', error)
          return null
        }
      },

      updateUserAddress: async (address) => {
        try {
          await accountApi.updateUserAddress(address)
          toast.success('Address updated successfully!')
        } catch (error) {
          toast.error('Failed to update address')
          throw error
        }
      },

      checkEmailExists: async (email) => {
        try {
          return await accountApi.checkEmailExists(email)
        } catch (error) {
          console.error('Failed to check email:', error)
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)