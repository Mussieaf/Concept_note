import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Banknote,
  Bike,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  PartyPopper,
  ShoppingBag,
  Smartphone,
  Store as StoreIcon,
  Trash2,
  Truck,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/CartContext'
import { FREE_DELIVERY_OVER } from '@/data/products'
import {
  buildOrderMessage,
  generateOrderId,
  money,
  orderLink,
  STORE,
} from '@/lib/whatsapp'
import type { Fulfillment, Order, PaymentMethod } from '@/types'
import { QtyStepper } from './ProductCard'
import WhatsAppIcon, { DoubleCheck } from './WhatsAppIcon'

type Step = 'cart' | 'details' | 'processing' | 'success'

const stepAnim = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
}

export default function CartDrawer() {
  const cart = useCart()
  const { isOpen, closeCart, items, subtotal, deliveryFee, clear, lastOrder, setLastOrder } = cart

  const [step, setStep] = useState<Step>('cart')
  const scrollRef = useRef<HTMLDivElement>(null)

  // form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('cart')
        setTried(false)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [step])

  const effectiveDeliveryFee = fulfillment === 'pickup' ? 0 : deliveryFee
  const grandTotal = subtotal + effectiveDeliveryFee

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Your name, so we can label the box'
    if (phone.replace(/\D/g, '').length < 7) e.phone = 'A valid phone number'
    if (fulfillment === 'delivery' && address.trim().length < 6)
      e.address = 'Street and number for the courier'
    if (payment === 'card') {
      if (cardNum.replace(/\D/g, '').length !== 16) e.card = '16-digit card number'
      if (!/^\d{2}\/\d{2}$/.test(expiry)) e.card = 'Expiry as MM/YY'
      if (!/^\d{3,4}$/.test(cvc)) e.card = 'CVC on the back'
    }
    return e
  }, [name, phone, fulfillment, address, payment, cardNum, expiry, cvc])

  const valid = Object.keys(errors).length === 0

  const buildOrder = (): Order => {
    const paidOnline = payment !== 'on-delivery'
    const paymentLabel =
      payment === 'card'
        ? `PAID ONLINE — Card ••${cardNum.replace(/\D/g, '').slice(-4)} ✅`
        : payment === 'mobile'
          ? 'PAID ONLINE — Mobile money ✅'
          : fulfillment === 'delivery'
            ? 'Pay on delivery (cash or card)'
            : 'Pay at pickup (cash or card)'
    return {
      id: generateOrderId(),
      items,
      subtotal,
      deliveryFee: effectiveDeliveryFee,
      total: grandTotal,
      customer: { name: name.trim(), phone: phone.trim(), fulfillment, address: address.trim(), note },
      paymentMethod: payment,
      paidOnline,
      paymentLabel,
      createdAt: new Date(),
    }
  }

  const placeOrder = () => {
    setTried(true)
    if (!valid) return
    const order = buildOrder()
    setLastOrder(order)
    const url = orderLink(order)

    if (order.paidOnline) {
      // open synchronously to dodge popup blockers, navigate after "payment"
      const w = window.open('', '_blank')
      setStep('processing')
      setTimeout(() => {
        if (w) w.location.href = url
        else window.open(url, '_blank')
        setStep('success')
        clear()
      }, 1700)
    } else {
      window.open(url, '_blank')
      setStep('success')
      clear()
    }
  }

  const fmtCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const missing = FREE_DELIVERY_OVER - subtotal

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-espresso/10 bg-cream p-0 sm:max-w-md"
      >
        <div className="flex items-center gap-3 border-b border-espresso/10 bg-white/70 px-5 py-4 backdrop-blur">
          {step === 'details' && (
            <button
              onClick={() => setStep('cart')}
              className="grid h-9 w-9 place-items-center rounded-full border border-espresso/10 text-espresso transition hover:bg-secondary"
              aria-label="Back to cart"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <SheetTitle className="font-display text-xl font-semibold text-espresso">
            {step === 'cart' && 'Your order'}
            {step === 'details' && 'Checkout'}
            {step === 'processing' && 'Confirming payment…'}
            {step === 'success' && 'Order sent 🎉'}
          </SheetTitle>
          {step === 'cart' && items.length > 0 && (
            <span className="rounded-full bg-wa/20 px-2.5 py-1 text-xs font-extrabold text-wa-deep">
              {cart.count} item{cart.count > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ───────────────────────── CART ───────────────────────── */}
            {step === 'cart' && (
              <motion.div key="cart" {...stepAnim} className="flex min-h-full flex-col px-5 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
                      <ShoppingBag className="h-9 w-9 text-espresso/40" />
                    </span>
                    <p className="mt-5 font-display text-2xl font-semibold text-espresso">
                      Your box is empty
                    </p>
                    <p className="mt-2 max-w-[240px] text-sm font-medium text-espresso/55">
                      The oven is hot and the croissants are calling. Add something delicious.
                    </p>
                    <a
                      href="#menu"
                      onClick={closeCart}
                      className="mt-6 rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream transition hover:bg-espresso/90"
                    >
                      Browse the menu
                    </a>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {items.map(({ product, qty }) => (
                          <motion.li
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                            className="flex gap-3 rounded-2xl border border-white/70 bg-white p-3 shadow-sm"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-espresso">
                                    {product.name}
                                  </p>
                                  <p className="text-xs font-semibold text-espresso/45">
                                    {money(product.price)} · {product.unit}
                                  </p>
                                </div>
                                <button
                                  onClick={() => cart.remove(product.id)}
                                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-espresso/35 transition hover:bg-red-50 hover:text-red-500"
                                  aria-label={`Remove ${product.name}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <QtyStepper
                                  size="sm"
                                  qty={qty}
                                  onChange={(q) => cart.setQty(product.id, q)}
                                />
                                <p className="text-sm font-extrabold text-espresso">
                                  {money(product.price * qty)}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    {/* free delivery meter */}
                    <div className="mt-4 rounded-2xl border border-wa/25 bg-wa/10 p-3.5">
                      {missing > 0 ? (
                        <>
                          <p className="text-xs font-bold text-wa-deep">
                            Add <span className="font-extrabold">{money(missing)}</span> more for free delivery
                          </p>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                            <motion.div
                              className="h-full rounded-full bg-wa"
                              animate={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_OVER) * 100)}%` }}
                              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="flex items-center gap-1.5 text-xs font-extrabold text-wa-deep">
                          <Truck className="h-4 w-4" /> Free delivery unlocked — nice.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-1.5 rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
                      <div className="flex justify-between text-sm font-semibold text-espresso/60">
                        <span>Subtotal</span>
                        <span className="tabular-nums">{money(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-espresso/60">
                        <span>Delivery</span>
                        <span className="tabular-nums">
                          {deliveryFee === 0 ? 'FREE' : money(deliveryFee)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base font-extrabold text-espresso">
                        <span>Total</span>
                        <span className="tabular-nums">{money(cart.total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ───────────────────────── DETAILS ───────────────────────── */}
            {step === 'details' && (
              <motion.div key="details" {...stepAnim} className="space-y-5 px-5 py-4">
                {/* contact */}
                <section className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-espresso/45">
                    Who's it for
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name" error={tried ? errors.name : undefined}>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="h-11 rounded-xl border-espresso/15 bg-white font-semibold"
                      />
                    </Field>
                    <Field label="Phone" error={tried ? errors.phone : undefined}>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555 0102"
                        type="tel"
                        className="h-11 rounded-xl border-espresso/15 bg-white font-semibold"
                      />
                    </Field>
                  </div>
                </section>

                {/* fulfillment */}
                <section className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-espresso/45">
                    Getting it to you
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        ['delivery', Bike, 'Delivery', deliveryFee === 0 ? 'Free' : money(deliveryFee)],
                        ['pickup', StoreIcon, 'Pickup', 'Free'],
                      ] as const
                    ).map(([val, Icon, label, sub]) => (
                      <button
                        key={val}
                        onClick={() => setFulfillment(val)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                          fulfillment === val
                            ? 'border-wa bg-wa/10'
                            : 'border-espresso/10 bg-white hover:border-espresso/25'
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            fulfillment === val ? 'bg-wa text-wa-ink' : 'bg-secondary text-espresso/60'
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold text-espresso">{label}</span>
                          <span className="block text-xs font-semibold text-espresso/50">{sub}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence initial={false}>
                    {fulfillment === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Field label="Delivery address" error={tried ? errors.address : undefined}>
                          <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="21 Baker St, Apt 4"
                            className="h-11 rounded-xl border-espresso/15 bg-white font-semibold"
                          />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Note for the kitchen (optional) — allergies, “extra glaze”, door code…"
                    rows={2}
                    className="resize-none rounded-xl border-espresso/15 bg-white text-sm font-semibold"
                  />
                </section>

                {/* payment */}
                <section className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-espresso/45">
                    Payment
                  </h3>
                  <div className="space-y-2.5">
                    {(
                      [
                        ['card', CreditCard, 'Pay online now', 'Card — instant, secured'],
                        ['mobile', Smartphone, 'Mobile money', 'We text you a payment prompt'],
                        ['on-delivery', Banknote, fulfillment === 'delivery' ? 'Pay on delivery' : 'Pay at pickup', 'Cash or card when it arrives'],
                      ] as const
                    ).map(([val, Icon, label, sub]) => (
                      <div key={val}>
                        <button
                          onClick={() => setPayment(val)}
                          className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                            payment === val
                              ? 'border-wa bg-wa/10'
                              : 'border-espresso/10 bg-white hover:border-espresso/25'
                          }`}
                        >
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                              payment === val ? 'bg-wa text-wa-ink' : 'bg-secondary text-espresso/60'
                            }`}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-extrabold text-espresso">{label}</span>
                            <span className="block text-xs font-semibold text-espresso/50">{sub}</span>
                          </span>
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border-2 transition ${
                              payment === val ? 'border-wa bg-wa' : 'border-espresso/20'
                            }`}
                          >
                            {payment === val && <span className="h-2 w-2 rounded-full bg-wa-ink" />}
                          </span>
                        </button>

                        {val === 'card' && payment === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2.5 space-y-2.5 rounded-2xl border border-espresso/10 bg-white p-3.5">
                              <Input
                                value={cardNum}
                                onChange={(e) => setCardNum(fmtCard(e.target.value))}
                                placeholder="4242 4242 4242 4242"
                                inputMode="numeric"
                                className="h-11 rounded-xl border-espresso/15 font-semibold tracking-wide"
                              />
                              <div className="grid grid-cols-2 gap-2.5">
                                <Input
                                  value={expiry}
                                  onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                                  placeholder="MM/YY"
                                  inputMode="numeric"
                                  className="h-11 rounded-xl border-espresso/15 font-semibold"
                                />
                                <Input
                                  value={cvc}
                                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  placeholder="CVC"
                                  inputMode="numeric"
                                  className="h-11 rounded-xl border-espresso/15 font-semibold"
                                />
                              </div>
                              {tried && errors.card && (
                                <p className="text-xs font-bold text-red-500">{errors.card}</p>
                              )}
                              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-espresso/45">
                                <Lock className="h-3 w-3" /> Demo checkout — no real charge is made.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ─────────────────────── PROCESSING ─────────────────────── */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                {...stepAnim}
                className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-12 w-12 text-wa-teal" />
                </motion.div>
                <p className="mt-6 font-display text-2xl font-semibold text-espresso">
                  Charging {money(grandTotal)}…
                </p>
                <p className="mt-2 max-w-[260px] text-sm font-medium text-espresso/55">
                  Securing your payment, then WhatsApp opens with your order slip ready to send.
                </p>
              </motion.div>
            )}

            {/* ─────────────────────── SUCCESS ─────────────────────── */}
            {step === 'success' && lastOrder && (
              <motion.div key="success" {...stepAnim} className="px-5 py-5">
                <div className="flex flex-col items-center text-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-wa text-wa-ink"
                  >
                    <PartyPopper className="h-9 w-9" />
                  </motion.span>
                  <h3 className="mt-5 font-display text-3xl font-semibold text-espresso">
                    Almost done!
                  </h3>
                  <p className="mt-2 max-w-[300px] text-sm font-medium text-espresso/60">
                    WhatsApp opened with order <span className="font-extrabold text-espresso">#{lastOrder.id}</span> pre-written — just press{' '}
                    <span className="font-extrabold text-espresso">send</span> in the chat.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                        lastOrder.paidOnline ? 'bg-wa/20 text-wa-deep' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lastOrder.paidOnline ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Banknote className="h-3.5 w-3.5" />
                      )}
                      {lastOrder.paymentLabel}
                    </span>
                    <span className="rounded-full bg-espresso px-3 py-1.5 text-xs font-extrabold text-cream">
                      Total {money(lastOrder.total)}
                    </span>
                  </div>
                </div>

                {/* message preview */}
                <p className="mb-2 mt-6 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-espresso/40">
                  Your order slip — zero guesswork for the kitchen
                </p>
                <div className="chat-wallpaper rounded-3xl border border-espresso/10 p-3.5">
                  <div className="bubble-out ml-auto max-w-[92%] p-3">
                    <pre className="whitespace-pre-wrap font-sans text-[11.5px] font-medium leading-relaxed text-wa-ink">
                      {buildOrderMessage(lastOrder)}
                    </pre>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9.5px] text-[#8696A0]">
                      {lastOrder.createdAt.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                      <DoubleCheck className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={orderLink(lastOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-wa py-3.5 text-sm font-extrabold text-wa-ink shadow-[0_10px_24px_-10px_rgba(37,211,102,0.9)] transition hover:brightness-105"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Open chat
                  </a>
                  <button
                    onClick={closeCart}
                    className="rounded-2xl bg-espresso py-3.5 text-sm font-extrabold text-cream transition hover:bg-espresso/90"
                  >
                    Keep browsing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* sticky footer CTAs */}
        {step === 'cart' && items.length > 0 && (
          <div className="border-t border-espresso/10 bg-white/80 p-4 backdrop-blur">
            <button
              onClick={() => setStep('details')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-wa py-4 text-[15px] font-extrabold text-wa-ink shadow-[0_14px_30px_-10px_rgba(37,211,102,0.9)] transition hover:brightness-105 active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Checkout · {money(cart.total)}
            </button>
            <p className="mt-2.5 text-center text-[11px] font-semibold text-espresso/45">
              Your order arrives on our WhatsApp as a perfect slip — no typos, no mix-ups.
            </p>
          </div>
        )}

        {step === 'details' && (
          <div className="border-t border-espresso/10 bg-white/80 p-4 backdrop-blur">
            <button
              onClick={placeOrder}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-wa py-4 text-[15px] font-extrabold text-wa-ink shadow-[0_14px_30px_-10px_rgba(37,211,102,0.9)] transition hover:brightness-105 active:scale-[0.99]"
            >
              {payment === 'on-delivery' ? (
                <WhatsAppIcon className="h-5 w-5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {payment === 'on-delivery'
                ? `Send order on WhatsApp · ${money(grandTotal)}`
                : `Pay ${money(grandTotal)} & send on WhatsApp`}
            </button>
            <p className="mt-2.5 text-center text-[11px] font-semibold text-espresso/45">
              {STORE.name} · {STORE.displayPhone}
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold text-espresso/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-bold text-red-500">{error}</span>}
    </label>
  )
}
