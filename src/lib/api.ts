import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import type { 
  Product, 
  Pagination, 
  Brand, 
  ProductType, 
  ShopParams, 
  Basket, 
  BasketItem, 
  User, 
  Address, 
  DeliveryMethod, 
  Order, 
  OrderToCreate 
} from '@/types'

const api = axios.create({
  baseURL: 'http://talaabat.runasp.net/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { data, status } = error.response || {}
    
    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/account/login'
      return
    }
    
    if (status === 400) {
      if (data.errors) {
        const modalStateErrors = []
        for (const key in data.errors) {
          if (data.errors[key]) {
            modalStateErrors.push(data.errors[key])
          }
        }
        throw modalStateErrors.flat()
      } else {
        toast.error(data.message || 'Bad request')
      }
    }
    
    if (status === 404) {
      toast.error('Resource not found')
    }
    
    if (status === 500) {
      toast.error('Internal server error')
    }
    
    return Promise.reject(error)
  }
)

// Helper function to extract response data
const responseBody = <T>(response: AxiosResponse<T>) => response.data

// Shop API
export const shopApi = {
  getProducts: (params: ShopParams): Promise<Pagination> => {
    const urlParams = new URLSearchParams()
    
    if (params.brandId > 0) urlParams.append('brandId', params.brandId.toString())
    if (params.typeId > 0) urlParams.append('categoryId', params.typeId.toString())
    if (params.search) urlParams.append('search', params.search)
    
    urlParams.append('sort', params.sort)
    urlParams.append('pageIndex', params.pageNumber.toString())
    urlParams.append('pageSize', params.pageSize.toString())
    
    return api.get<Pagination>(`/products?${urlParams}`).then(responseBody)
  },
  
  getProduct: (id: number): Promise<Product> =>
    api.get<Product>(`/products/${id}`).then(responseBody),
    
  getBrands: (): Promise<Brand[]> =>
    api.get<Brand[]>('/products/brands').then(responseBody),
    
  getTypes: (): Promise<ProductType[]> =>
    api.get<ProductType[]>('/products/categories').then(responseBody),
}

// Basket API
export const basketApi = {
  getBasket: (id: string): Promise<Basket> =>
    api.get<Basket>(`/basket?id=${id}`).then(responseBody),
    
  setBasket: (basket: Basket): Promise<Basket> =>
    api.post<Basket>('/basket', basket).then(responseBody),
    
  deleteBasket: (id: string): Promise<void> =>
    api.delete(`/basket?id=${id}`).then(responseBody),
    
  createPaymentIntent: (basketId: string): Promise<Basket> =>
    api.post<Basket>(`/payments/${basketId}`, {}).then(responseBody),
}

// Account API
export const accountApi = {
  login: (credentials: { email: string; password: string }): Promise<User> =>
    api.post<User>('/account/login', credentials).then(responseBody),
    
  register: (userData: { displayName: string; email: string; password: string }): Promise<User> =>
    api.post<User>('/account/register', userData).then(responseBody),
    
  getCurrentUser: (): Promise<User> =>
    api.get<User>('/account').then(responseBody),
    
  getUserAddress: (): Promise<Address> =>
    api.get<Address>('/account/address').then(responseBody),
    
  updateUserAddress: (address: Address): Promise<Address> =>
    api.put<Address>('/account/address', address).then(responseBody),
    
  checkEmailExists: (email: string): Promise<boolean> =>
    api.get<boolean>(`/account/emailexists?email=${email}`).then(responseBody),
}

// Orders API
export const ordersApi = {
  getOrders: (): Promise<Order[]> =>
    api.get<Order[]>('/orders').then(responseBody),
    
  getOrder: (id: number): Promise<Order> =>
    api.get<Order>(`/orders/${id}`).then(responseBody),
    
  createOrder: (order: OrderToCreate): Promise<Order> =>
    api.post<Order>('/orders', order).then(responseBody),
    
  getDeliveryMethods: (): Promise<DeliveryMethod[]> =>
    api.get<DeliveryMethod[]>('/orders/deliveryMethods').then(responseBody),
}

// Checkout API
export const checkoutApi = {
  getDeliveryMethods: (): Promise<DeliveryMethod[]> =>
    api.get<DeliveryMethod[]>('/orders/deliveryMethods').then(responseBody),
}

export default api