import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '@/data/products'
import ProductCard from './ProductCard'

export default function MenuSection() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All')

  const visible =
    cat === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)

  return (
    <section id="menu" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-wa-teal">
            <Flame className="h-3.5 w-3.5" /> Baked today, gone today
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
            The menu
          </h2>
          <p className="mt-3 max-w-md text-[15px] font-medium text-espresso/60">
            What you see is what's on the bench right now — the same live menu we
            answer with on WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-full px-4 py-2 text-sm font-bold transition ${
                cat === c
                  ? 'text-cream'
                  : 'border border-espresso/10 bg-white/70 text-espresso/65 hover:border-espresso/25 hover:text-espresso'
              }`}
            >
              {cat === c && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-espresso"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
