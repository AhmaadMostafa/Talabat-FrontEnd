import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa'
import { useShopStore } from '@/stores/shopStore'
import { useBasketStore } from '@/stores/basketStore'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import SafeImage from '@/components/shared/SafeImage'
import { toast } from 'react-hot-toast'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  
  const { getProduct } = useShopStore()
  const { addItemToBasket } = useBasketStore()

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        const productData = await getProduct(parseInt(id))
        setProduct(productData)
      } catch (error) {
        toast.error('Failed to load product')
        navigate('/shop')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id, getProduct, navigate])

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToBasket = async () => {
    if (!product) return
    
    try {
      await addItemToBasket(product, quantity)
      toast.success(`Added ${quantity} ${product.name} to basket`, {
        style: {
          background: '#FF6600',
          color: '#fff',
        }
      })
    } catch (error) {
      toast.error('Failed to add item to basket')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <button
              onClick={() => navigate('/shop')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-4 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to Menu
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image - Left Side */}
          <div className="md:w-2/5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <SafeImage
                  src={product.pictureUrl || '/assets/images/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="md:w-3/5">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500 uppercase mb-1">{product.brand}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-3xl font-bold text-orange-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FaMinus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <FaPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToBasket}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-3 font-medium"
                >
                  <FaShoppingCart className="h-5 w-5" />
                  Add to Cart • ${(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* Product Category */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Category</h3>
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Add to Cart button for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaMinus className="h-4 w-4" />
            </button>
            <span className="text-lg font-semibold w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleAddToBasket}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FaShoppingCart className="h-5 w-5" />
            Add • ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}