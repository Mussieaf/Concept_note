import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { money } from '@/lib/whatsapp'
import type { Product } from '@/types'

const BADGE_STYLES: Record<NonNullable<Product['badge']>, string> = {
  Bestseller: 'bg-amber-400/95 text-amber-950',
  New: 'bg-wa text-wa-ink',
  Vegan: 'bg-emerald-700 text-white',
  'Weekend only': 'bg-espresso text-cream',
}

export function QtyStepper({
  qty,
  onChange,
  size = 'md',
}: {
  qty: number
  onChange: (qty: number) => void
  size?: 'md' | 'sm'
}) {
  const btn =
    size === 'sm'
      ? 'h-7 w-7 rounded-lg'
      : 'h-9 w-9 rounded-xl'
  return (
    <div
      className={`flex items-center gap-0.5 rounded-xl bg-espresso text-cream ${
        size === 'sm' ? 'rounded-lg p-0.5' : 'p-1'
      }`}
    >
      <button
        onClick={() => onChange(qty - 1)}
        className={`grid ${btn} place-items-center transition hover:bg-white/15 active:scale-90`}
        aria-label="Decrease quantity"
      >
        <Minus className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
      <motion.span
        key={qty}
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        className={`grid place-items-center font-extrabold tabular-nums ${
          size === 'sm' ? 'w-6 text-[13px]' : 'w-8 text-sm'
        }`}
      >
        {qty}
      </motion.span>
      <button
        onClick={() => onChange(qty + 1)}
        className={`grid ${btn} place-items-center transition hover:bg-white/15 active:scale-90`}
        aria-label="Increase quantity"
      >
        <Plus className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
    </div>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const { add, setQty, qtyOf, openCart } = useCart()
  const qty = qtyOf(product.id)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_10px_36px_-18px_rgba(34,24,18,0.3)] transition hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgba(34,24,18,0.4)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-md ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-espresso backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)} · {product.sold}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[19px] font-semibold leading-tight text-espresso">
            {product.name}
          </h3>
          <div className="text-right leading-tight">
            <p className="text-[17px] font-extrabold text-wa-deep">{money(product.price)}</p>
            <p className="text-[10.5px] font-semibold text-espresso/45">{product.unit}</p>
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13.5px] font-medium leading-relaxed text-espresso/60">
          {product.desc}
        </p>

        <div className="mt-4 flex-1" />

        <AnimatePresence mode="wait" initial={false}>
          {qty === 0 ? (
            <motion.button
              key="add"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              onClick={() => add(product)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-wa py-3 text-sm font-extrabold text-wa-ink shadow-[0_10px_24px_-10px_rgba(37,211,102,0.9)] transition hover:brightness-105 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
              Add to order
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between gap-2"
            >
              <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} />
              <button
                onClick={openCart}
                className="rounded-2xl border-2 border-espresso/10 bg-secondary px-4 py-2.5 text-[13px] font-extrabold text-espresso transition hover:border-wa/50 hover:bg-wa/15"
              >
                {money(product.price * qty)} →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}
