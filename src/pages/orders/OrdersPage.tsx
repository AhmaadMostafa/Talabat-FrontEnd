import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, Clock, X, Eye, MapPin, Utensils, ShoppingBag } from 'lucide-react'

// Status mapping for display
const statusMap = {
  0: 'Pending',
  1: 'Preparing', 
  2: 'On the Way',
  3: 'Delivered',
  4: 'Cancelled'
}

// Status colors
const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Preparing': 'bg-blue-100 text-blue-800',
  'On the Way': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
}

// Status icons
const statusIcons = {
  'Pending': Clock,
  'Preparing': Utensils,
  'On the Way': Truck,
  'Delivered': CheckCircle,
  'Cancelled': X
}

// Simple image component with proper loading states
const SafeImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Only show fallback if there's actually an error or no src
  if (!src) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    )
  }
  
  return (
    <div className={`${className} relative bg-gray-100 rounded-lg overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => {
          setIsLoading(false)
          setHasError(false)
        }}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
      )}
    </div>
  )
}

// Country code to name mapping
const countryNames = {
  'EG': 'Egypt',
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France'
}

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Direct fetch with authentication
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')
        
        if (!token) {
          setError('Authentication required. Please log in.')
          setLoading(false)
          return
        }

        const response = await fetch('http://talaabat.runasp.net/api/Orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.')
          } else if (response.status === 403) {
            throw new Error('Access denied.')
          } else {
            throw new Error(`Failed to load orders: ${response.status}`)
          }
        }
        
        const ordersData = await response.json()
        setOrders(ordersData)
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading orders:', err)
        setError(err.message || 'Failed to load orders')
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusDisplay = (status: string | number) => {
    return typeof status === 'string' ? status : statusMap[status as keyof typeof statusMap] || 'Unknown'
  }

  const handleViewOrder = (orderId: number) => {
    // Navigate to order detail page
    window.location.href = `/orders/${orderId}`
  }

  const getEstimatedDelivery = (orderDate: string, deliveryMethod: string) => {
    const date = new Date(orderDate)
    // Add estimated minutes based on delivery method (food delivery is faster)
    const deliveryMinutes = deliveryMethod?.toLowerCase().includes('express') ? 30 : 45
    date.setMinutes(date.getMinutes() + deliveryMinutes)
    
    return `${formatTime(date.toISOString())}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading your orders...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Unable to Load Orders</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet. Start ordering to see your food deliveries here.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Order Food
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusDisplay = getStatusDisplay(order.status)
            const StatusIcon = statusIcons[statusDisplay as keyof typeof statusIcons] || Package
            
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      <div className={`p-2 rounded-full ${statusColors[statusDisplay as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.orderDate)} at {formatTime(order.orderDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[statusDisplay as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {statusDisplay}
                      </span>
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 md:p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-3">
                        {order.items?.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <SafeImage 
                              src={item.pictureUrl} 
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.productName}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-sm font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {order.items?.length > 3 && (
                          <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">${order.deliveryMethodCost.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Delivery Address
                        </h5>
                        <div className="text-sm text-gray-600">
                          <p className="truncate">{order.shippingAddress?.street}</p>
                          <p>{order.shippingAddress?.city}, {countryNames[order.shippingAddress?.country as keyof typeof countryNames] || order.shippingAddress?.country}</p>
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      {statusDisplay !== 'Delivered' && statusDisplay !== 'Cancelled' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-800 font-medium">Est. delivery: {getEstimatedDelivery(order.orderDate, order.deliveryMethod)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
                  <div>Placed on {formatDate(order.orderDate)} at {formatTime(order.orderDate)}</div>
                  <div className="mt-1 sm:mt-0">Customer: {order.buyerEmail}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage