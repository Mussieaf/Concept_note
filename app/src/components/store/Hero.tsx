import { motion } from 'framer-motion'
import { ArrowDown, Star, Timer, Zap } from 'lucide-react'
import PhoneMockup from './PhoneMockup'
import WhatsAppIcon from './WhatsAppIcon'
import { chatLink, STORE } from '@/lib/whatsapp'

const fade = {
  hidden: { opacity: 0, y: 26 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-14 pt-28 sm:pt-32">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-wa/15 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-8%] h-[420px] w-[420px] rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div>
          <motion.div variants={fade} custom={0} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-wa/30 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-wa-deep shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-wa" />
              </span>
              Open now · taking today's orders on WhatsApp
            </span>
          </motion.div>

          <motion.h1
            variants={fade}
            custom={0.1}
            initial="hidden"
            animate="show"
            className="mt-5 font-display text-[42px] font-semibold leading-[1.04] tracking-tight text-espresso sm:text-6xl lg:text-[64px]"
          >
            Take{' '}
            <span className="relative whitespace-nowrap text-wa-deep">
              chat orders
              <svg viewBox="0 0 220 12" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
                <path d="M2 9C60 3 160 3 218 8" stroke="#25D366" strokeWidth="5" strokeLinecap="round" fill="none" />
              </svg>
            </span>{' '}
            &amp; payments online.
          </motion.h1>

          <motion.p
            variants={fade}
            custom={0.2}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-espresso/70"
          >
            Fewer mistakes, faster deals. Customers pick from a live menu, pay in
            the browser, and a perfectly structured order lands in your WhatsApp —
            no apps to install, no chats to decipher.
          </motion.p>

          <motion.div
            variants={fade}
            custom={0.3}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-sm font-bold text-cream shadow-[0_14px_30px_-10px_rgba(34,24,18,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-10px_rgba(34,24,18,0.55)]"
            >
              Browse the menu
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <a
              href={chatLink(`Hi ${STORE.name}! I'd like to place an order`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 text-sm font-extrabold text-wa-ink shadow-[0_14px_30px_-10px_rgba(37,211,102,0.8)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              Chat with the bakery
            </a>
          </motion.div>

          <motion.dl
            variants={fade}
            custom={0.42}
            initial="hidden"
            animate="show"
            className="mt-10 grid max-w-lg grid-cols-3 gap-3"
          >
            {[
              { icon: Zap, k: '40 sec', v: 'avg. checkout' },
              { icon: Star, k: '4.9 / 5', v: 'from 800+ chats' },
              { icon: Timer, k: '0 lost', v: 'orders this month' },
            ].map(({ icon: Icon, k, v }) => (
              <div
                key={v}
                className="rounded-2xl border border-white/70 bg-white/70 p-3.5 shadow-sm backdrop-blur"
              >
                <Icon className="h-4 w-4 text-wa-teal" />
                <dt className="mt-1.5 font-display text-xl font-semibold text-espresso">{k}</dt>
                <dd className="text-xs font-semibold text-espresso/55">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  )
}
