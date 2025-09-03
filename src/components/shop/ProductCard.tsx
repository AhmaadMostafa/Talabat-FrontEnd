import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useBasketStore } from '@/stores/basketStore'
import type { Product } from '@/types'
import { toast } from 'react-hot-toast'
import SafeImage from '@/components/shared/SafeImage'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItemToBasket } = useBasketStore()

  const handleAddToBasket = async () => {
    try {
      await addItemToBasket(product, 1)
    } catch (error) {
      toast.error('Failed to add item to basket')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <SafeImage
          src={product.pictureUrl || '/assets/images/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Restaurant Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {product.brand}
          </span>
        </div>
        {/* Quick Add Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToBasket}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
          >
            <FaShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
          <Link 
            to={`/shop/${product.id}`}
            className="hover:text-orange-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-orange-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">per item</span>
          </div>
          
          <button
            onClick={handleAddToBasket}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <FaShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}