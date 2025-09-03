import { Link } from 'react-router-dom'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import type { BasketItem } from '@/types'
import SafeImage from '@/components/shared/SafeImage'

interface BasketSummaryProps {
  items: BasketItem[]
  isBasket?: boolean
  onIncrement?: (item: BasketItem) => void
  onDecrement?: (item: BasketItem) => void
  onRemove?: (item: BasketItem) => void
}

export default function BasketSummary({
  items,
  isBasket = false,
  onIncrement,
  onDecrement,
  onRemove,
}: BasketSummaryProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No items to display</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <SafeImage
                  className="h-20 w-20 rounded-lg object-cover"
                  src={item.pictureUrl || '/assets/images/placeholder.png'}
                  alt={item.productName}
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 leading-tight">
                      {isBasket ? (
                        <Link 
                          to={`/shop/${item.id}`}
                          className="hover:text-orange-600 transition-colors"
                        >
                          {item.productName}
                        </Link>
                      ) : (
                        item.productName
                      )}
                    </h3>
                    {item.brand && (
                      <p className="text-xs text-gray-600 mt-1">by {item.brand}</p>
                    )}
                    {item.category && (
                      <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    )}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 ml-4">
                    {isBasket && onDecrement && (
                      <button
                        onClick={() => onDecrement(item)}
                        className="p-2 rounded-full text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <FaMinus className="h-4 w-4" />
                      </button>
                    )}
                    <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    {isBasket && onIncrement && (
                      <button
                        onClick={() => onIncrement(item)}
                        className="p-2 rounded-full text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <FaPlus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Price Information */}
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-600">
                    ${item.price.toFixed(2)} each
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              {isBasket && onRemove && (
                <div className="flex-shrink-0 ml-2">
                  <button
                    onClick={() => onRemove(item)}
                    className="p-3 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}