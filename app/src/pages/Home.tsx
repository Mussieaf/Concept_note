import { CartProvider } from '@/context/CartContext'
import Header from '@/components/store/Header'
import Hero from '@/components/store/Hero'
import Marquee from '@/components/store/Marquee'
import MenuSection from '@/components/store/MenuSection'
import HowItWorks from '@/components/store/HowItWorks'
import WhySection from '@/components/store/WhySection'
import FaqSection from '@/components/store/FaqSection'
import Footer from '@/components/store/Footer'
import CartDrawer from '@/components/store/CartDrawer'
import FloatingChat from '@/components/store/FloatingChat'

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-clip bg-background">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <MenuSection />
          <HowItWorks />
          <WhySection />
          <FaqSection />
        </main>
        <Footer />
        <CartDrawer />
        <FloatingChat />
      </div>
    </CartProvider>
  )
}
