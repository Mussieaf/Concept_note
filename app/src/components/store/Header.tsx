import { motion, AnimatePresence } from 'framer-motion'
import { Croissant, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { chatLink, STORE } from '@/lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

const NAV = [
  { label: 'Menu', href: '#menu' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why chat orders', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const { count, openCart } = useCart()

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-white/60 bg-cream/85 px-3 py-2.5 shadow-[0_8px_30px_-12px_rgba(34,24,18,0.25)] backdrop-blur-xl sm:px-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-wa-deep text-white shadow-inner">
              <Croissant className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-semibold tracking-tight">
                Crumb &amp; Craft
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-wa-teal sm:block">
                WhatsApp Store
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-espresso/70 transition hover:bg-espresso/5 hover:text-espresso"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={chatLink(`Hi ${STORE.name}! I have a question about the menu`)}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-wa-ink shadow-[0_6px_16px_-6px_rgba(37,211,102,0.7)] transition hover:brightness-105 md:flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {STORE.displayPhone}
            </a>

            <button
              onClick={openCart}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-espresso text-cream transition hover:bg-espresso/90"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-wa px-1 text-[11px] font-extrabold text-wa-ink ring-2 ring-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
