import clsx from 'clsx'
import type { Brand, ProductType, ShopParams } from '@/types'

interface ProductFiltersProps {
  brands: Brand[]
  productTypes: ProductType[]
  shopParams: ShopParams
  onBrandSelect: (brandId: number) => void
  onTypeSelect: (typeId: number) => void
}

export default function ProductFilters({
  brands,
  productTypes,
  shopParams,
  onBrandSelect,
  onTypeSelect,
}: ProductFiltersProps) {
  // Add "All" option to brands and types
  const allBrands = [{ id: 0, name: 'All' }, ...brands]
  const allTypes = [{ id: 0, name: 'All' }, ...productTypes]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Quick Filters */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Quick Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onBrandSelect(0)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              shopParams.brandId === 0
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All Restaurants
          </button>
        </div>
      </div>

      {/* Restaurants Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Restaurants
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onBrandSelect(brand.id)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group',
                brand.id === shopParams.brandId
                  ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
              )}
            >
              <span className="font-medium">{brand.name}</span>
              {brand.id === shopParams.brandId && (
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Types Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Cuisine Types
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group',
                type.id === shopParams.typeId
                  ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
              )}
            >
              <span className="font-medium">{type.name}</span>
              {type.id === shopParams.typeId && (
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <p className="font-semibold text-orange-800 text-sm">Fast Delivery</p>
            <p className="text-orange-600 text-xs">30-45 minutes average</p>
          </div>
        </div>
      </div>
    </div>
  )
}