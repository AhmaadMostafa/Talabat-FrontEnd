import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ordersApi, basketApi, accountApi } from '@/lib/api'
import { useBasketStore } from '@/stores/basketStore'
import { useAuthStore } from '@/stores/authStore'
import type { Address, DeliveryMethod, OrderToCreate } from '@/types'

// Load Stripe (you'll need to add your publishable key to environment variables)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rh9RQ2eFmCKyESszUBOZUjt8tT9H6BlebSNauSAyjuuFMf7DfHFVfpnwIPeOOXvGuTb0ZS9IQswjKxjlNygriZo00W8kybZZ7')

interface CheckoutFormProps {
  onOrderCreated: (orderId: number) => void
}

function CheckoutFormContent({ onOrderCreated }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  
  const { basket, clearBasket } = useBasketStore()
  const { user } = useAuthStore()
  
  // Country name/code mapping to bridge UI/Stripe (ISO code) and API (full name)
  const COUNTRY_CODE_TO_NAME: Record<string, string> = {
    EG: 'Egypt', US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
    DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands', BE: 'Belgium',
    CH: 'Switzerland', AT: 'Austria', SE: 'Sweden', NO: 'Norway', DK: 'Denmark', FI: 'Finland',
    IE: 'Ireland', PT: 'Portugal', GR: 'Greece', PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary',
    SK: 'Slovakia', SI: 'Slovenia', HR: 'Croatia', RO: 'Romania', BG: 'Bulgaria', LT: 'Lithuania',
    LV: 'Latvia', EE: 'Estonia', MT: 'Malta', CY: 'Cyprus', LU: 'Luxembourg', JP: 'Japan',
    KR: 'South Korea', CN: 'China', IN: 'India', SG: 'Singapore', MY: 'Malaysia', TH: 'Thailand',
    ID: 'Indonesia', PH: 'Philippines', VN: 'Vietnam', BR: 'Brazil', MX: 'Mexico', AR: 'Argentina',
    CL: 'Chile', CO: 'Colombia', PE: 'Peru', ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya',
    GH: 'Ghana', MA: 'Morocco', TN: 'Tunisia', DZ: 'Algeria', LY: 'Libya', SD: 'Sudan',
    AE: 'United Arab Emirates', SA: 'Saudi Arabia', KW: 'Kuwait', QA: 'Qatar', OM: 'Oman',
    BH: 'Bahrain', JO: 'Jordan', LB: 'Lebanon', SY: 'Syria', IQ: 'Iraq', IR: 'Iran', TR: 'Turkey',
    IL: 'Israel', PS: 'Palestine',
  }
  const COUNTRY_NAME_TO_CODE: Record<string, string> = Object.entries(COUNTRY_CODE_TO_NAME)
    .reduce((acc, [code, name]) => { acc[name.toLowerCase()] = code; return acc }, {} as Record<string, string>)

  const convertCountryNameToCode = (value: string): string => {
    if (!value) return 'EG'
    if (value.length === 2 && COUNTRY_CODE_TO_NAME[value.toUpperCase()]) return value.toUpperCase()
    const code = COUNTRY_NAME_TO_CODE[value.toLowerCase()]
    return code || 'EG'
  }

  const convertCountryCodeToName = (code: string): string => {
    const name = COUNTRY_CODE_TO_NAME[code?.toUpperCase?.()]
    return name || code
  }

  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    country: 'EG' // Default to Egypt's country code
  })

  useEffect(() => {
    if (!basket || basket.items.length === 0) {
      navigate('/basket')
      return
    }

    // Load delivery methods and create payment intent
    const initializeCheckout = async () => {
      try {
        // Load delivery methods
        const methods = await ordersApi.getDeliveryMethods()
        setDeliveryMethods(methods)
        if (methods.length > 0) {
          setSelectedDeliveryMethod(methods[0])
        }

        // Create payment intent
        const updatedBasket = await basketApi.createPaymentIntent(basket.id)
        if (updatedBasket?.clientSecret) {
          setClientSecret(updatedBasket.clientSecret)
        }
      } catch (error) {
        console.error('Initialization error:', error)
        toast.error('Failed to initialize checkout')
      }
    }

    initializeCheckout()
  }, [basket, navigate])

  // Load user's saved address and prefill if available
  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddress = await accountApi.getUserAddress()
        if (savedAddress) {
          setAddress(prev => ({
            ...prev,
            ...savedAddress,
            country: convertCountryNameToCode(savedAddress.country)
          }))
        }
      } catch (error) {
        // Silently ignore if user has no saved address or request fails
      }
    }

    if (user) loadSavedAddress()
  }, [user])

  // Update payment intent when delivery method changes
  useEffect(() => {
    const updatePaymentIntent = async () => {
      if (basket && selectedDeliveryMethod && clientSecret) {
        try {
          // Check if updatePaymentIntent method exists, otherwise recreate payment intent
          if (basketApi.updatePaymentIntent && typeof basketApi.updatePaymentIntent === 'function') {
            const updatedBasket = await basketApi.updatePaymentIntent(basket.id, selectedDeliveryMethod.id)
            if (updatedBasket.clientSecret) {
              setClientSecret(updatedBasket.clientSecret)
            }
          } else {
            // Fallback: recreate payment intent with new delivery method
            const updatedBasket = await basketApi.createPaymentIntent(basket.id, selectedDeliveryMethod.id)
            if (updatedBasket.clientSecret) {
              setClientSecret(updatedBasket.clientSecret)
            }
          }
        } catch (error) {
          console.error('Failed to update payment intent:', error)
          // Don't show error toast for this, as it's not critical
        }
      }
    }

    updatePaymentIntent()
  }, [selectedDeliveryMethod])

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setSelectedDeliveryMethod(method)
  }

  const validateForm = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'street', 'city', 'country']
    for (const field of requiredFields) {
      if (!address[field as keyof Address]?.trim()) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`)
        return false
      }
    }

    if (!selectedDeliveryMethod) {
      toast.error('Please select a delivery method')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements || !clientSecret || !basket) {
      toast.error('Payment system not ready. Please try again.')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Attempt to persist/update the user's address before payment
      try {
        const apiAddress = { ...address, country: convertCountryCodeToName(address.country) }
        await accountApi.updateUserAddress(apiAddress)
      } catch {
        // Non-blocking: continue even if address update fails
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // STEP 1: Confirm payment with Stripe FIRST
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${address.firstName} ${address.lastName}`,
            email: user?.email,
            address: {
              line1: address.street,
              city: address.city,
              country: address.country,
            },
          },
        },
        shipping: {
          name: `${address.firstName} ${address.lastName}`,
          address: {
            line1: address.street,
            city: address.city,
            country: address.country,
          },
        },
      })

      // STEP 2: Handle payment errors
      if (paymentError) {
        console.error('Payment failed:', paymentError)
        
        // Handle specific error types
        switch (paymentError.type) {
          case 'card_error':
          case 'validation_error':
            toast.error(paymentError.message || 'Payment failed. Please check your card details.')
            break
          case 'authentication_required':
            toast.error('Authentication required. Please try again.')
            break
          default:
            toast.error('Payment failed. Please try again.')
        }
        
        return // Don't create order if payment failed
      }

      // STEP 3: Only create order AFTER payment succeeds
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          // Create order with payment confirmation
          const shippingAddressForApi = { ...address, country: convertCountryCodeToName(address.country) }
          const orderData: OrderToCreate = {
            basketId: basket.id,
            deliveryMethodId: selectedDeliveryMethod!.id,
            shippingAddress: shippingAddressForApi,
            paymentIntentId: paymentIntent.id // Include payment intent ID
          }

          const order = await ordersApi.createOrder(orderData)
          
          // Clear basket and redirect to success page
          clearBasket()
          toast.success('Payment successful! Your order has been placed.')
          
          // Navigate to success page with order ID as query parameter
          navigate(`/checkout/success?orderId=${order.id}`)
          
          onOrderCreated(order.id)
          
        } catch (orderError) {
          console.error('Failed to create order after successful payment:', orderError)
          toast.error('Payment was successful, but there was an issue creating your order. Please contact support with your payment confirmation.')
        }
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        // Handle async payment methods
        toast.success('Payment is being processed. You will receive an email confirmation once complete.')
        // You might want to redirect to a "payment processing" page
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // This should be handled by confirmCardPayment, but just in case
        toast.error('Additional authentication is required. Please try again.')
      } else {
        toast.error('Payment was not completed. Please try again.')
      }

    } catch (error: any) {
      console.error('Checkout error:', error)
      
      // Handle network errors
      if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
        toast.error('Network error. Please check your connection and try again.')
      } else if (error.message?.includes('Your card was declined')) {
        toast.error('Your card was declined. Please try a different payment method.')
      } else {
        toast.error(error.message || 'Checkout failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!basket || basket.items.length === 0) {
    return null
  }

  const subtotal = basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost = selectedDeliveryMethod?.cost || 0
  const total = subtotal + shippingCost

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={address.firstName}
              onChange={(e) => handleAddressChange('firstName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={address.lastName}
              onChange={(e) => handleAddressChange('lastName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              value={address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              value={address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Country</option>
              <option value="EG">Egypt</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="CH">Switzerland</option>
              <option value="AT">Austria</option>
              <option value="SE">Sweden</option>
              <option value="NO">Norway</option>
              <option value="DK">Denmark</option>
              <option value="FI">Finland</option>
              <option value="IE">Ireland</option>
              <option value="PT">Portugal</option>
              <option value="GR">Greece</option>
              <option value="PL">Poland</option>
              <option value="CZ">Czech Republic</option>
              <option value="HU">Hungary</option>
              <option value="SK">Slovakia</option>
              <option value="SI">Slovenia</option>
              <option value="HR">Croatia</option>
              <option value="RO">Romania</option>
              <option value="BG">Bulgaria</option>
              <option value="LT">Lithuania</option>
              <option value="LV">Latvia</option>
              <option value="EE">Estonia</option>
              <option value="MT">Malta</option>
              <option value="CY">Cyprus</option>
              <option value="LU">Luxembourg</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="SG">Singapore</option>
              <option value="MY">Malaysia</option>
              <option value="TH">Thailand</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
              <option value="VN">Vietnam</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
              <option value="CO">Colombia</option>
              <option value="PE">Peru</option>
              <option value="ZA">South Africa</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
              <option value="MA">Morocco</option>
              <option value="TN">Tunisia</option>
              <option value="DZ">Algeria</option>
              <option value="LY">Libya</option>
              <option value="SD">Sudan</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="KW">Kuwait</option>
              <option value="QA">Qatar</option>
              <option value="OM">Oman</option>
              <option value="BH">Bahrain</option>
              <option value="JO">Jordan</option>
              <option value="LB">Lebanon</option>
              <option value="SY">Syria</option>
              <option value="IQ">Iraq</option>
              <option value="IR">Iran</option>
              <option value="TR">Turkey</option>
              <option value="IL">Israel</option>
              <option value="PS">Palestine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Method</h3>
        <div className="space-y-3">
          {deliveryMethods.map((method) => (
            <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="deliveryMethod"
                value={method.id}
                checked={selectedDeliveryMethod?.id === method.id}
                onChange={() => handleDeliveryMethodChange(method)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.shortName}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                    <p className="text-xs text-gray-400">Delivery time: {method.deliveryTime}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${method.cost.toFixed(2)}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your payment information is secure and encrypted.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">${shippingCost.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!stripe || loading || !selectedDeliveryMethod || !clientSecret}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}

export default function CheckoutForm(props: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent {...props} />
    </Elements>
  )
}