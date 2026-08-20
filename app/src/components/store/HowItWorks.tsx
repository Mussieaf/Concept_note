import { motion } from 'framer-motion'
import { CreditCard, ShoppingBag } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

const STEPS = [
  {
    icon: ShoppingBag,
    step: '01',
    title: 'Fill your cart',
    text: 'Browse the live menu and tap to add. Quantities, sizes and prices are locked in — no "wait, was that two croissants or three?"',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'Pay your way',
    text: 'Card or mobile money right in the browser — or pay on delivery. Online payments land instantly, so the kitchen starts sooner.',
  },
  {
    icon: WhatsAppIcon,
    step: '03',
    title: 'Order lands in WhatsApp',
    text: 'A structured order slip — items, totals, address, payment status — arrives in one message. We confirm in minutes. Done.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-wa-teal">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
          From craving to confirmed in one chat
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, step, title, text }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-7 shadow-[0_10px_40px_-18px_rgba(34,24,18,0.25)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(34,24,18,0.35)]"
          >
            <span className="pointer-events-none absolute -right-3 -top-6 font-display text-[92px] font-semibold leading-none text-espresso/[0.05] transition group-hover:text-wa/15">
              {step}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-wa-deep text-white shadow-lg">
              <Icon className="h-5.5 w-5.5 h-[22px] w-[22px]" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-espresso">{title}</h3>
            <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-espresso/65">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
