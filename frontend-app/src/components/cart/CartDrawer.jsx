import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiShoppingCart, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatFees } from '../../lib/utils'
import api from '../../lib/api'

// load razorpay script
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// single cart item card
function CartItem({ institute, onRemove }) {
  const { user } = useAuth()

  // each item has its own plan selection
  const hasAnnual = institute.fees?.annual > 0
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [paying, setPaying] = useState(false)

  const amount = selectedPlan === 'annual' ? institute.fees?.annual : institute.fees?.monthly

  const handlePayNow = async () => {
    if (!user) {
      toast.error('Please login first')
      return
    }

    setPaying(true)

    try {
      const loaded = await loadRazorpay()
      if (!loaded) {
        toast.error('Failed to load payment gateway')
        setPaying(false)
        return
      }

      const { data } = await api.post('/payment/create-order', {
        amount: amount,
        instituteName: institute.name,
        planType: selectedPlan
      })

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'CoachFinder',
        description: `${institute.name} — ${selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Plan`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            toast.success(`Payment successful for ${institute.name}!`)
            onRemove(institute._id)
          } catch (err) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: () => {
            setPaying(false)
            toast('Payment cancelled', { icon: '⚠️' })
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (res) => {
        toast.error(`Payment failed: ${res.error.description}`)
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed, try again')
      setPaying(false)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-gray-800/80 border border-white/10">
      {/* institute info */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={institute.images?.[0]?.url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200'}
          alt={institute.name}
          className="w-14 h-14 rounded-lg object-cover shrink-0"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200' }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">{institute.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{institute.category}</p>
        </div>
        <button
          onClick={() => onRemove(institute._id)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
        >
          <FiTrash2 size={15} />
        </button>
      </div>

      {/* plan selection */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSelectedPlan('monthly')}
          className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
            selectedPlan === 'monthly'
              ? 'border-violet-500 bg-violet-500/15 text-violet-300'
              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {selectedPlan === 'monthly' && <FiCheck size={11} />}
            Monthly
          </span>
          <span className="font-bold">{formatFees(institute.fees?.monthly)}</span>
        </button>

        {hasAnnual && (
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              selectedPlan === 'annual'
                ? 'border-green-500 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {selectedPlan === 'annual' && <FiCheck size={11} />}
              Yearly
            </span>
            <span className="font-bold">{formatFees(institute.fees?.annual)}</span>
          </button>
        )}
      </div>

      {/* pay now */}
      <button
        onClick={handlePayNow}
        disabled={paying}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay Now — ${formatFees(amount)}`
        )}
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, clearCart } = useCart()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-gray-900 border-l border-white/10 z-50 flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FiShoppingCart className="text-violet-400" size={20} />
                <h2 className="text-white font-bold text-lg">My Cart</h2>
                {cartItems.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FiShoppingCart size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                  <p className="text-gray-600 text-xs mt-1">Add institutes to get started</p>
                </div>
              ) : (
                cartItems.map((institute) => (
                  <CartItem
                    key={institute._id}
                    institute={institute}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-medium transition-all"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
