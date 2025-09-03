import { v4 as uuidv4 } from 'uuid'

// User types
export interface User {
  email: string
  displayName: string
  token: string
}

// Product types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  pictureUrl: string
  category: string
  brand: string
}

// Brand and Product Type
export interface Brand {
  id: number
  name: string
}

export interface ProductType {
  id: number
  name: string
}

// Basket types
export interface BasketItem {
  id: number
  productName: string
  price: number
  quantity: number
  pictureUrl: string
  brand: string
  category: string
}

export interface Basket {
  id: string
  items: BasketItem[]
  clientSecret?: string
  paymentIntentId?: string
  deliveryMethodId?: number
  shippingPrice?: number
}

export interface BasketTotals {
  shipping: number
  subtotal: number
  total: number
}

// Address types
export interface Address {
  firstName: string
  lastName: string
  street: string
  city: string
  country: string
}

// Delivery Method
export interface DeliveryMethod {
  shortName: string
  deliveryTime: string
  description: string
  cost: number
  id: number
}

// Order types
export interface OrderToCreate {
  basketId: string
  deliveryMethodId: number
  shippingAddress: Address
}

export interface OrderItem {
  productId: number
  productName: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  buyerEmail: string
  orderDate: string
  shipToAddress: Address
  deliveryMethod: string
  deliveryCost: number
  items: OrderItem[]
  subtotal: number
  status: string
  total: number
}

// Pagination types
export interface Pagination<T = Product> {
  pageIndex: number
  pageSize: number
  count: number
  data: T[]
}

// Shop parameters
export interface ShopParams {
  brandId: number
  typeId: number
  sort: string
  pageNumber: number
  pageSize: number
  search?: string
}

// Utility function to create new basket
export const createBasket = (): Basket => ({
  id: uuidv4(),
  items: [],
})

// API Error Response
export interface ApiError {
  message: string
  statusCode: number
  details?: string
}