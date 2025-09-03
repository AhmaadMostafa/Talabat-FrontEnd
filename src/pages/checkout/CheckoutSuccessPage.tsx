import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Package, Truck, Mail, Download, ShoppingBag, Clock, MapPin, CreditCard } from 'lucide-react'

// Status mapping for display
const statusMap = {
  0: 'Pending',
  1: 'Processing', 
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled'
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

function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Get orderId from URL query parameters
        const urlParams = new URLSearchParams(window.location.search)
        const orderId = urlParams.get('orderId')
        
        if (!orderId) {
          setError('No order ID provided')
          setLoading(false)
          return
        }

        // Use direct fetch with auth
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')
        
        if (!token) {
          setError('Authentication required. Please log in.')
          setLoading(false)
          return
        }

        const response = await fetch(`http://talaabat.runasp.net/api/Orders/${orderId}`, {
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
            throw new Error('Access denied. You can only view your own orders.')
          } else if (response.status === 404) {
            throw new Error('Order not found.')
          } else {
            throw new Error(`Failed to load order: ${response.status}`)
          }
        }
        
        const orderData = await response.json()
        
        setOrder(orderData)
        setLoading(false)
      } catch (err) {
        console.error('Error loading order:', err)
        setError(err.message || 'Failed to load order details')
        setLoading(false)
      }
    }

    loadOrder()
  }, [])

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // Generate invoice download
    const invoiceData = {
      orderId: order.id,
      date: order.orderDate,
      items: order.items,
      total: order.total
    }
    console.log('Downloading invoice...', invoiceData)
    // In production, this would trigger a PDF download
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEstimatedDelivery = (orderDate, deliveryMethod) => {
    const date = new Date(orderDate)
    // Add estimated minutes based on delivery method (food delivery is faster)
    const deliveryMinutes = deliveryMethod?.toLowerCase().includes('express') ? 30 : 45
    date.setMinutes(date.getMinutes() + deliveryMinutes)
    
    return `${formatTime(date)}`
  }

  const getStatusInfo = (status) => {
    const statusStr = typeof status === 'string' ? status : statusMap[status] || 'Unknown'
    
    switch (statusStr.toLowerCase()) {
      case 'pending':
        return { color: 'yellow', step: 1 }
      case 'processing':
        return { color: 'yellow', step: 2 }
      case 'shipped':
        return { color: 'green', step: 3 }
      case 'delivered':
        return { color: 'green', step: 4 }
      default:
        return { color: 'gray', step: 1 }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Order not found'}
          </h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const currentStatus = typeof order.status === 'string' ? order.status : statusMap[order.status] || 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. Your food is being prepared.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <p className="text-green-800 font-semibold">Order #: {order.id}</p>
            <p className="text-green-600 text-sm">{formatDate(order.orderDate)} at {formatTime(order.orderDate)}</p>
          </div>
        </div>

        {/* Delivery Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
              currentStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {currentStatus}
            </span>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Estimated Delivery</p>
              <p className="text-gray-600">{getEstimatedDelivery(order.orderDate, order.deliveryMethod)}</p>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Order placed</span>
              <span className="text-sm text-gray-600">Preparing</span>
              <span className="text-sm text-gray-600">On the way</span>
              <span className="text-sm text-gray-600">Delivered</span>
            </div>
            <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-500"
                style={{ width: `${(statusInfo.step / 4) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <div className={`w-3 h-3 rounded-full ${statusInfo.step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${statusInfo.step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${statusInfo.step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${statusInfo.step >= 4 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={item.pictureUrl} 
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fallback = e.target.parentElement.querySelector('.image-fallback')
                        if (fallback) fallback.style.display = 'flex'
                      }}
                      onLoad={(e) => {
                        const fallback = e.target.parentElement.querySelector('.image-fallback')
                        if (fallback) fallback.style.display = 'none'
                      }}
                    />
                    <div className="image-fallback absolute inset-0 bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${order.deliveryMethodCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-6">
            
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p className="text-gray-600">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">{order.shippingAddress.city}, {countryNames[order.shippingAddress.country] || order.shippingAddress.country}</p>
                </div>

                <div className="pt-3 border-t">
                  <h3 className="font-medium text-gray-900 mb-1">Delivery Method</h3>
                  <p className="text-gray-600">{order.deliveryMethod}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium text-green-600">Paid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Continue shopping</span>
            </button>
            
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Package className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Order History</span>
            </button>

            <button
              onClick={handlePrintReceipt}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Print Receipt</span>
            </button>

            <button
              onClick={handleDownloadInvoice}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Download Invoice</span>
            </button>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start mb-2">
            <Mail className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Order confirmation sent</p>
              <p className="text-blue-600 text-sm">
                We've sent a confirmation email to {order.buyerEmail} with your order details.
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600">View real-time updates on your delivery status.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600">Having issues with your order? Contact our support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage