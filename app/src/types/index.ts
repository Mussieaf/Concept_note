export type Category = 'Breads' | 'Pastries' | 'Cakes' | 'Sweets'

export interface Product {
  id: string
  name: string
  desc: string
  price: number
  unit: string
  category: Category
  image: string
  badge?: 'Bestseller' | 'New' | 'Vegan' | 'Weekend only'
  rating: number
  sold: string
}

export interface CartItem {
  product: Product
  qty: number
}

export type Fulfillment = 'delivery' | 'pickup'
export type PaymentMethod = 'card' | 'mobile' | 'on-delivery'

export interface CustomerInfo {
  name: string
  phone: string
  fulfillment: Fulfillment
  address: string
  note: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  customer: CustomerInfo
  paymentMethod: PaymentMethod
  paidOnline: boolean
  paymentLabel: string
  createdAt: Date
}
