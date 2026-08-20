import { motion } from 'framer-motion'
import { CheckCheck, CreditCard, Phone, Search, Video } from 'lucide-react'
import { DoubleCheck } from './WhatsAppIcon'

const bubble = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: d, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] select-none sm:w-[330px]">
      {/* glow */}
      <div className="absolute -inset-8 -z-10 rounded-[4rem] bg-gradient-to-br from-wa/40 via-wa-teal/20 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-[2.6rem] border-[10px] border-espresso bg-espresso shadow-[0_40px_80px_-24px_rgba(20,30,25,0.55)]">
        <div className="relative rounded-[1.9rem] overflow-hidden">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-espresso" />

          {/* WA header */}
          <div className="flex items-center gap-2.5 bg-wa-deep px-3 pb-2.5 pt-8 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-wa text-lg">🥐</div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13.5px] font-bold">Crumb &amp; Craft</p>
              <p className="text-[10.5px] text-white/75">
                online · replies in ~5 min
              </p>
            </div>
            <Video className="h-4.5 w-4.5 h-[18px] w-[18px] text-white/85" />
            <Phone className="h-[16px] w-[16px] text-white/85" />
            <Search className="h-[16px] w-[16px] text-white/85" />
          </div>

          {/* chat body */}
          <div className="chat-wallpaper space-y-2.5 px-2.5 py-3 text-[11.5px] leading-snug">
            <motion.div
              variants={bubble}
              custom={0.15}
              initial="hidden"
              animate="show"
              className="mx-auto w-fit rounded-lg bg-[#FDF3C6] px-3 py-1.5 text-center text-[10px] font-medium text-[#54656F] shadow-sm"
            >
              🔒 Messages and orders are end-to-end encrypted
            </motion.div>

            {/* outgoing structured order */}
            <motion.div
              variants={bubble}
              custom={0.45}
              initial="hidden"
              animate="show"
              className="bubble-out ml-auto w-[88%] p-2.5"
            >
              <p className="font-bold text-wa-ink">🧾 NEW ORDER #CC-8K2Q</p>
              <div className="my-1.5 border-t border-dashed border-black/15" />
              <p>▪️ 2 × Butter Croissant — $7.50</p>
              <p>▪️ 1 × Country Sourdough — $8.50</p>
              <p>▪️ 1 × Cinnamon Roll — $4.25</p>
              <div className="my-1.5 border-t border-dashed border-black/15" />
              <p>Delivery: <span className="font-semibold">FREE</span></p>
              <p className="text-[13px] font-extrabold">TOTAL: $20.25</p>
              <div className="my-1.5 border-t border-dashed border-black/15" />
              <p className="flex items-center gap-1 font-semibold text-wa-deep">
                <CreditCard className="h-3 w-3" /> Paid online · Visa ••4242
              </p>
              <p className="mt-0.5">🚚 21 Baker St, Apt 4 · 6:00 PM</p>
              <div className="mt-1 flex items-center justify-end gap-1 text-[9.5px] text-[#8696A0]">
                17:42 <DoubleCheck className="h-3.5 w-3.5" />
              </div>
            </motion.div>

            {/* incoming confirmation */}
            <motion.div
              variants={bubble}
              custom={1.15}
              initial="hidden"
              animate="show"
              className="bubble-in w-[78%] p-2.5"
            >
              <p>
                Got it, Jane! Payment received ✅ Your order is on the bench —
                ready at <span className="font-semibold">6:00 PM</span>. 🥐
              </p>
              <div className="mt-1 text-right text-[9.5px] text-[#8696A0]">17:43</div>
            </motion.div>

            {/* typing */}
            <motion.div
              variants={bubble}
              custom={1.9}
              initial="hidden"
              animate="show"
              className="bubble-in flex w-14 items-center justify-center gap-1 px-3 py-2.5"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-[#8696A0]"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </motion.div>
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 bg-[#F0F2F5] px-2.5 py-2">
            <div className="flex-1 rounded-full bg-white px-3.5 py-2 text-[11px] text-[#8696A0]">
              Message
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-wa-teal text-white">
              <CheckCheck className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-16 top-24 hidden rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:block"
      >
        <p className="text-[10px] font-bold uppercase tracking-wide text-wa-teal">Zero mistakes</p>
        <p className="text-[13px] font-extrabold text-espresso">Structured order slip 🧾</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-14 bottom-28 hidden rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:block"
      >
        <p className="text-[10px] font-bold uppercase tracking-wide text-wa-teal">Paid before baking</p>
        <p className="text-[13px] font-extrabold text-espresso">$20.25 · Visa ✅</p>
      </motion.div>
    </div>
  )
}
