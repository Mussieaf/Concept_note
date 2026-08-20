import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { STORE } from '@/lib/whatsapp'

const FAQS = [
  {
    q: 'How does WhatsApp ordering actually work?',
    a: `You build your order here — items, quantities, delivery details, payment. When you tap "Send order", WhatsApp opens with a perfectly formatted order slip pre-written. Hit send, and it lands directly in our chat at ${STORE.displayPhone}. We confirm within minutes.`,
  },
  {
    q: 'Can I really pay online?',
    a: 'Yes — card and mobile money are processed securely in the browser before your order is sent. The WhatsApp message includes your payment status, so the kitchen starts immediately. Prefer cash? Choose "Pay on delivery" at checkout.',
  },
  {
    q: 'Where do you deliver, and how much is it?',
    a: 'We deliver within 5 km of the bakery. Delivery is a flat $2.99 — and free on orders over $25. Pickup from the shop is always free.',
  },
  {
    q: 'What if I need a custom cake or a big order?',
    a: 'For custom cakes, catering, or orders over 20 items, just message us on WhatsApp directly — the chat button is always in the bottom-right corner. Custom cakes need 48 hours notice.',
  },
  {
    q: 'Why not just text my order like before?',
    a: 'You still can! But the store removes the back-and-forth: live prices, locked quantities, no typos, instant payment. Your order slip arrives formatted — we bake what you meant to order.',
  },
]

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-wa-teal">Questions</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
          Asked in our chats, daily
        </h2>
      </div>

      <Accordion type="single" collapsible className="mt-10 space-y-3">
        {FAQS.map(({ q, a }, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-2xl border border-white/70 bg-white/80 px-5 shadow-sm backdrop-blur data-[state=open]:border-wa/40"
          >
            <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-espresso hover:no-underline">
              {q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] font-medium leading-relaxed text-espresso/65">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
