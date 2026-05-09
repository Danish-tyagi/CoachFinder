import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

// Load Razorpay script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function ApplyModal({ institute, onClose }) {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'monthly',
      label: 'Monthly Plan',
      amount: institute.fees?.monthly || 0,
      description: 'Pay month by month, cancel anytime',
      badge: null,
    },
    ...(institute.fees?.annual > 0
      ? [{
          id: 'annual',
          label: 'Annual Plan',
          amount: institute.fees.annual,
          description: 'Best value — pay once for the full year',
          badge: 'Best Value',
        }]
      : []),
  ]

  const selected = plans.find((p) => p.id === selectedPlan)

  const handlePayment = async () => {
    if (!user) return toast.error('Please login to continue')

    setLoading(true)
    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your internet connection.')
        setLoading(false)
        return
      }

      // 2. Create order on backend
      const { data } = await api.post('/payment/create-order', {
        amount: selected.amount,
        currency: 'INR',
        instituteName: institute.name,
        planType: selectedPlan,
      })

      // 3. Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: institute.name,
        description: `${selected.label} Enrollment`,
        order_id: data.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#7c3aed',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled', { icon: '⚠️' })
          },
        },
        // Debug: log any errors
        notify: {
          missing_id_number: false,
          invalid_id_number: false,
        },
        handler: async (response) => {
          try {
            // 4. Verify payment on backend
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('🎉 Payment successful! Enrollment confirmed.')
            onClose()
          } catch {
            toast.error('Payment verification failed. Contact support.')
          } finally {
            setLoading(false)
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-blue-600/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <FiX size={16} />
            </button>
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">Enrollment</p>
            <h2 className="text-xl font-bold text-white pr-8">{institute.name}</h2>
            <p className="text-sm text-gray-400 mt-1">Select a plan to proceed with payment</p>
          </div>

          {/* Plan Selection */}
          <div className="p-6 space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Radio circle */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedPlan === plan.id ? 'border-violet-500 bg-violet-500' : 'border-gray-600'
                    }`}>
                      {selectedPlan === plan.id && <FiCheck size={11} className="text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{plan.label}</span>
                        {plan.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${selectedPlan === plan.id ? 'text-violet-400' : 'text-gray-300'}`}>
                    ₹{plan.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            ))}

            {/* Summary */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">{selected?.label}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-medium">₹{selected?.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                <span className="text-gray-300 font-semibold">Total Payable</span>
                <span className="text-violet-400 font-bold text-base">₹{selected?.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-violet-500/25 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <FiLoader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{selected?.amount.toLocaleString('en-IN')} Securely
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                🔒 Secured by Razorpay
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">UPI · Cards · NetBanking</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
