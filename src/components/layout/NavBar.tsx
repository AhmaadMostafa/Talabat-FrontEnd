import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaHistory, FaSignOutAlt } from 'react-icons/fa'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useBasketStore } from '@/stores/basketStore'
import clsx from 'clsx'

export default function NavBar() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { basket } = useBasketStore()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const basketItemCount = basket?.items.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/assets/images/logo.jpg" 
              alt="Logo" 
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium uppercase">
            <Link
              to="/"
              className={clsx(
                'px-3 py-2 transition-colors',
                isActive('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              )}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={clsx(
                'px-3 py-2 transition-colors',
                isActive('/shop')
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              )}
            >
              Shop
            </Link>
          </nav>

          {/* Right side - Basket and User */}
          <div className="flex items-center space-x-4">
            {/* Basket */}
            <Link to="/basket" className="relative p-2">
              <FaShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary-600 transition-colors" />
              {basketItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {basketItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <FaUser className="h-5 w-5" />
                  <span className="hidden md:block font-medium">
                    Welcome {user.displayName}
                  </span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/basket"
                            className={clsx(
                              'flex items-center px-4 py-2 text-sm',
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            )}
                          >
                            <FaShoppingCart className="mr-3 h-4 w-4" />
                            View Basket
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/orders"
                            className={clsx(
                              'flex items-center px-4 py-2 text-sm',
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            )}
                          >
                            <FaHistory className="mr-3 h-4 w-4" />
                            View Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={clsx(
                              'flex items-center w-full px-4 py-2 text-sm text-left',
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            )}
                          >
                            <FaSignOutAlt className="mr-3 h-4 w-4" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/account/login"
                  className="btn btn-outline btn-sm"
                >
                  Login
                </Link>
                <Link
                  to="/account/register"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex justify-center space-x-6 text-sm font-medium uppercase">
            <Link
              to="/"
              className={clsx(
                'px-3 py-2 transition-colors',
                isActive('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              )}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={clsx(
                'px-3 py-2 transition-colors',
                isActive('/shop')
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              )}
            >
              Shop
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}