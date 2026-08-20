const ITEMS = [
  'Structured order slips',
  'Paid before we bake',
  'No misread chats',
  'Live menu, zero phone tag',
  'Instant WhatsApp confirmation',
  'Fewer mistakes · faster deals',
]

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="overflow-hidden border-y border-espresso/10 bg-espresso py-3.5">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm font-bold text-cream/90">
            {t}
            <span className="text-wa">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
