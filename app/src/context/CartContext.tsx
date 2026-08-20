import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Order, Product } from '@/types'
import { DELIVERY_FEE, FREE_DELIVERY_OVER, PRODUCTS } from '@/data/products'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  deliveryFee: number
  total: number
  isOpen: boolean
  lastOrder: Order | null
  add: (product: Product) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  qtyOf: (productId: string) => number
  openCart: () => void
  closeCart: () => void
  setLastOrder: (order: Order | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'crumbcraft-cart-v1'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: { id: string; qty: number }[] = JSON.parse(raw)
    return parsed
      .map(({ id, qty }) => {
        const product = PRODUCTS.find((p) => p.id === id)
        return product ? { product, qty } : null
      })
      .filter((x): x is CartItem => x !== null)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart())
  const [isOpen, setIsOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map((i) => ({ id: i.product.id, qty: i.qty }))),
      )
    } catch {
      /* private mode — ignore */
    }
  }, [items])

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id)
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const qtyOf = useCallback(
    (productId: string) =>
      items.find((i) => i.product.id === productId)?.qty ?? 0,
    [items],
  )

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0)
    const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0)
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE
    return {
      items,
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      isOpen,
      lastOrder,
      add,
      setQty,
      remove,
      clear,
      qtyOf,
      openCart,
      closeCart,
      setLastOrder,
    }
  }, [items, isOpen, lastOrder, add, setQty, remove, clear, qtyOf, openCart, closeCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
