import { useEffect, useRef } from 'react'
import { useShopStore } from '@/stores/shopStore'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import Pagination from '@/components/shared/Pagination'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const sortOptions = [
  { name: 'Alphabetical', value: 'name' },
  { name: 'Price: Low to high', value: 'priceAsc' },
  { name: 'Price: High to low', value: 'priceDesc' },
]

export default function ShopPage() {
  const searchRef = useRef<HTMLInputElement>(null)
  
  const {
    products,
    brands,
    productTypes,
    pagination,
    shopParams,
    isLoading,
    getProducts,
    getBrands,
    getProductTypes,
    setShopParams,
    resetShopParams,
  } = useShopStore()

  useEffect(() => {
    getProducts(true)
    getBrands()
    getProductTypes()
  }, [getProducts, getBrands, getProductTypes])

  const handleBrandSelect = (brandId: number) => {
    setShopParams({ brandId, pageNumber: 1 })
    getProducts(false)
  }

  const handleTypeSelect = (typeId: number) => {
    setShopParams({ typeId, pageNumber: 1 })
    getProducts(false)
  }

  const handleSortChange = (sort: string) => {
    setShopParams({ sort })
    getProducts(false)
  }

  const handlePageChange = (pageNumber: number) => {
    if (shopParams.pageNumber !== pageNumber) {
      setShopParams({ pageNumber })
      getProducts(true)
    }
  }

  const handleSearch = () => {
    const searchValue = searchRef.current?.value || ''
    setShopParams({ search: searchValue, pageNumber: 1 })
    getProducts(false)
  }

  const handleReset = () => {
    if (searchRef.current) {
      searchRef.current.value = ''
    }
    resetShopParams()
    getProducts(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Amazing Food</h1>
            <p className="text-lg opacity-90 mb-6">Order from your favorite restaurants and get it delivered fast</p>
            
            {/* Main Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for food, restaurants, or cuisines..."
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                />
                <button
                  onClick={handleSearch}
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-white font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden">
            <button className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
              <span className="font-medium text-gray-700">Filters & Categories</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </button>
          </div>

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ProductFilters
                brands={brands}
                productTypes={productTypes}
                shopParams={shopParams}
                onBrandSelect={handleBrandSelect}
                onTypeSelect={handleTypeSelect}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {pagination?.count || 0} items found
                </h2>
                {(shopParams.brandId > 0 || shopParams.typeId > 0 || shopParams.search) && (
                  <button
                    onClick={handleReset}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={shopParams.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Products */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No food found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters to find what you're looking for</p>
                  <button
                    onClick={handleReset}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.count > shopParams.pageSize && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={shopParams.pageNumber}
                  totalPages={Math.ceil(pagination.count / shopParams.pageSize)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}