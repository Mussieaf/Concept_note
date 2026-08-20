import { motion } from 'framer-motion'
import WhatsAppIcon from './WhatsAppIcon'
import { chatLink, STORE } from '@/lib/whatsapp'

export default function FloatingChat() {
  return (
    <motion.a
      href={chatLink(`Hi ${STORE.name}! Quick question about the menu`)}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-wa p-4 text-wa-ink shadow-[0_16px_36px_-8px_rgba(18,140,126,0.6)] transition hover:brightness-105"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-wa" />
      <WhatsAppIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden text-sm font-extrabold transition-all duration-300 group-hover:ml-2 group-hover:max-w-[120px]">
        Chat with us
      </span>
    </motion.a>
  )
}
