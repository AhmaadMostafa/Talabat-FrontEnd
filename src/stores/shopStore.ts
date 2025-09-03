import { create } from 'zustand'
import { shopApi } from '@/lib/api'
import type { Product, Pagination, Brand, ProductType, ShopParams } from '@/types'

interface ShopState {
  products: Product[]
  brands: Brand[]
  productTypes: ProductType[]
  pagination: Pagination | null
  shopParams: ShopParams
  productCache: Map<string, Product[]>
  isLoading: boolean
  brandsLoading: boolean
  typesLoading: boolean
  
  // Actions
  getProducts: (useCache?: boolean) => Promise<void>
  getProduct: (id: number) => Promise<Product | null>
  getBrands: () => Promise<void>
  getProductTypes: () => Promise<void>
  setShopParams: (params: Partial<ShopParams>) => void
  resetShopParams: () => void
  clearCache: () => void
}

const defaultShopParams: ShopParams = {
  brandId: 0,
  typeId: 0,
  sort: 'name',
  pageNumber: 1,
  pageSize: 6,
  search: '',
}

export const useShopStore = create<ShopState>()((set, get) => ({
  products: [],
  brands: [],
  productTypes: [],
  pagination: null,
  shopParams: defaultShopParams,
  productCache: new Map(),
  isLoading: false,
  brandsLoading: false,
  typesLoading: false,

  getProducts: async (useCache = true) => {
    const state = get()
    const cacheKey = Object.values(state.shopParams).join('-')
    
    // Check cache first if useCache is true
    if (useCache && state.productCache.has(cacheKey)) {
      const cachedProducts = state.productCache.get(cacheKey)!
      set({
        products: cachedProducts,
        pagination: {
          ...state.pagination!,
          data: cachedProducts,
        },
      })
      return
    }

    // Clear cache if useCache is false
    if (!useCache) {
      set({ productCache: new Map() })
    }

    set({ isLoading: true })
    try {
      const pagination = await shopApi.getProducts(state.shopParams)
      
      // Update cache
      const newCache = new Map(state.productCache)
      newCache.set(cacheKey, pagination.data)
      
      set({
        products: pagination.data,
        pagination,
        productCache: newCache,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      console.error('Failed to get products:', error)
    }
  },

  getProduct: async (id: number) => {
    const state = get()
    
    // Check cache first
    for (const products of state.productCache.values()) {
      const product = products.find(p => p.id === id)
      if (product) {
        return product
      }
    }

    try {
      return await shopApi.getProduct(id)
    } catch (error) {
      console.error('Failed to get product:', error)
      return null
    }
  },

  getBrands: async () => {
    const state = get()
    if (state.brands.length > 0 || state.brandsLoading) return

    set({ brandsLoading: true })
    try {
      const brands = await shopApi.getBrands()
      // Ensure no duplicates by using a Map to deduplicate by id
      const uniqueBrands = Array.from(
        new Map(brands.map(brand => [brand.id, brand])).values()
      )
      set({ brands: uniqueBrands, brandsLoading: false })
    } catch (error) {
      console.error('Failed to get brands:', error)
      set({ brandsLoading: false })
    }
  },

  getProductTypes: async () => {
    const state = get()
    if (state.productTypes.length > 0 || state.typesLoading) return

    set({ typesLoading: true })
    try {
      const productTypes = await shopApi.getTypes()
      // Ensure no duplicates by using a Map to deduplicate by id
      const uniqueTypes = Array.from(
        new Map(productTypes.map(type => [type.id, type])).values()
      )
      set({ productTypes: uniqueTypes, typesLoading: false })
    } catch (error) {
      console.error('Failed to get product types:', error)
      set({ typesLoading: false })
    }
  },

  setShopParams: (params: Partial<ShopParams>) => {
    set(state => ({
      shopParams: { ...state.shopParams, ...params }
    }))
  },

  resetShopParams: () => {
    set({ shopParams: defaultShopParams })
  },

  clearCache: () => {
    set({ productCache: new Map() })
  },
}))