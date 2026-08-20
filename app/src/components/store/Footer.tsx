import { Clock, Croissant, MapPin } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { chatLink, STORE } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-wa-deep text-white">
              <Croissant className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold text-espresso">Crumb &amp; Craft</span>
          </div>
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-espresso/60">
            An online store built for WhatsApp. Browse the live menu, pay online,
            and your order arrives in our chat as a perfect slip — fewer mistakes,
            faster deals.
          </p>
          <a
            href={chatLink(`Hi ${STORE.name}! I have a question`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-3 text-sm font-extrabold text-wa-ink shadow-[0_10px_24px_-10px_rgba(37,211,102,0.8)] transition hover:brightness-105"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Message us on WhatsApp
          </a>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-espresso/45">Visit</h4>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-espresso/75">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wa-teal" />
              {STORE.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-wa-teal" />
              {STORE.hours}
            </li>
            <li className="flex items-start gap-2.5">
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-wa-teal" />
              {STORE.displayPhone}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-espresso/45">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold text-espresso/75">
            {[
              ['Menu', '#menu'],
              ['How it works', '#how-it-works'],
              ['Why chat orders', '#why'],
              ['FAQ', '#faq'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition hover:text-wa-teal">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-espresso/10 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs font-semibold text-espresso/45 sm:px-6">
          © {new Date().getFullYear()} {STORE.name} · Demo store — set your own WhatsApp number in{' '}
          <code className="rounded bg-espresso/5 px-1.5 py-0.5">src/lib/whatsapp.ts</code>
        </p>
      </div>
    </footer>
  )
}
