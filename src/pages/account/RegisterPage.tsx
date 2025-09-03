import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'react-hot-toast'

interface RegisterFormData {
  displayName: string
  email: string
  phoneNumber: string
  password: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, checkEmailExists } = useAuthStore()
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>()

  const validateEmailNotTaken = async (email: string) => {
    if (!email) return true
    
    try {
      const emailExists = await checkEmailExists(email)
      return !emailExists || 'Email address is already in use'
    } catch (error) {
      return true // If check fails, allow submission and let server handle it
    }
  }

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return 'Phone number is required'
    
    // Remove any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '')
    
    // Validate based on common phone number patterns
    if (cleanedPhone.length < 10) return 'Phone number is too short'
    if (cleanedPhone.length > 15) return 'Phone number is too long'
    
    return true
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerErrors([])
      await registerUser(data)
      navigate('/shop')
    } catch (error: any) {
      if (Array.isArray(error)) {
        setServerErrors(error)
      } else {
        toast.error(error.message || 'Registration failed')
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Link to="/">
              <img
                className="h-12 w-auto"
                src="/assets/images/logo.jpg"
                alt="Talabat"
              />
            </Link>
            <h2 className="mt-8 text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Talabat to discover delicious food from your favorite restaurants
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverErrors.length > 0 && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There were {serverErrors.length} error(s) with your submission
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc space-y-1 pl-5">
                        {serverErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  {...register('displayName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  autoComplete="name"
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.displayName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.displayName && (
                  <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                    validate: validateEmailNotTaken,
                  })}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    validate: validatePhoneNumber,
                  })}
                  type="tel"
                  autoComplete="tel"
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                We'll use this number to contact you about your orders
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Create a secure password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-orange-600 hover:text-orange-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-orange-600 hover:text-orange-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading || isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/account/login"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-90"></div>
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=960&q=80"
          alt="Variety of food"
        />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h3 className="text-2xl font-bold mb-4">Discover thousands of restaurants</h3>
          <p className="text-lg">Create an account to save your preferences and order faster.</p>
        </div>
      </div>
    </div>
  )
}