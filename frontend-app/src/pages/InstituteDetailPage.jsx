import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiMapPin, FiPhone, FiMail, FiGlobe, FiClock,
  FiUsers, FiAward, FiArrowLeft, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import StarRating from '../components/ui/StarRating'
import CategoryBadge from '../components/ui/CategoryBadge'
import { formatFees } from '../lib/utils'

export default function InstituteDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToCart, isInCart, setCartOpen } = useCart()

  const [activeImg, setActiveImg] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/institutes/${id}` } })
    }
  }, [user, id, navigate])

  const { data, isLoading } = useQuery({
    queryKey: ['institute', id],
    queryFn: async () => {
      const { data } = await api.get(`/institutes/${id}`)
      return data.data
    },
    staleTime: 2 * 60 * 1000,
  })

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await api.post(`/institutes/${id}/reviews`, reviewData)
      return data
    },
    onSuccess: () => {
      toast.success('Review submitted!')
      setComment('')
      setRating(5)
      queryClient.invalidateQueries(['institute', id])
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    },
  })

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to submit a review')
    if (!comment.trim()) return toast.error('Please write a comment')
    reviewMutation.mutate({ rating, comment })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-20 bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-4">Institute not found</h2>
          <Link to="/institutes" className="text-violet-400 hover:underline">← Back to Institutes</Link>
        </div>
      </div>
    )
  }

  const inst = data
  const images = inst.images?.length > 0 ? inst.images : [{ url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200', caption: inst.name }]

  return (
    <div className="min-h-screen bg-gray-950 pb-16">

      {/* ── Back Button ── */}
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <Link
          to="/institutes"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-6"
        >
          <FiArrowLeft size={16} /> Back to Institutes
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left / Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden bg-gray-900 border border-white/10"
            >
              {/* Main image */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <img
                  src={images[activeImg]?.url}
                  alt={images[activeImg]?.caption || inst.name}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200' }}
                />
                {/* Gradient overlay — bottom only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImg(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Caption */}
                {images[activeImg]?.caption && (
                  <p className="absolute bottom-3 left-4 text-xs text-gray-300">{images[activeImg].caption}</p>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-violet-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title + Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-gray-900/80 border border-white/10 p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <CategoryBadge category={inst.category} />
                  {inst.isFeatured && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold border border-yellow-500/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                {inst.isVerified && (
                  <div className="flex items-center gap-1 text-blue-400 text-xs font-medium shrink-0">
                    <MdVerified size={18} /> Verified
                  </div>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{inst.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={inst.rating?.average || 0} size={16} />
                <span className="text-white font-semibold">{inst.rating?.average?.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({inst.rating?.count || 0} reviews)</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{inst.description}</p>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/10">
                {[
                  { label: 'Students', value: inst.students?.toLocaleString() || '—' },
                  { label: 'Faculty', value: inst.faculty || '—' },
                  { label: 'Est.', value: inst.established || '—' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Institute Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gray-900/80 border border-white/10 p-6"
            >
              <h2 className="text-lg font-bold text-white mb-5">Institute Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: FiMapPin, label: 'Address', value: inst.address?.fullAddress },
                  { icon: FiPhone, label: 'Phone', value: inst.phone },
                  { icon: FiMail, label: 'Email', value: inst.email },
                  { icon: FiGlobe, label: 'Website', value: inst.website, link: true },
                  { icon: FiClock, label: 'Timing', value: inst.timing },
                  { icon: FiUsers, label: 'Batch Size', value: inst.batchSize ? `${inst.batchSize} students` : null },
                ].filter(i => i.value).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="text-violet-400" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      {item.link ? (
                        <a href={item.value} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-violet-400 hover:underline break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            {inst.features?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl bg-gray-900/80 border border-white/10 p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Features & Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {inst.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/15 text-violet-300 text-sm border border-violet-500/25">
                      <span className="text-violet-400">✓</span> {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-gray-900/80 border border-white/10 p-6"
            >
              <h2 className="text-lg font-bold text-white mb-5">
                Reviews <span className="text-gray-500 font-normal text-base">({inst.reviews?.length || 0})</span>
              </h2>

              {/* Write Review */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm font-semibold text-white mb-3">Write a Review</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Your Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRating(r)}
                          className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all ${
                            rating >= r
                              ? 'bg-yellow-500 border-yellow-400 text-yellow-950'
                              : 'bg-gray-800 border-white/10 text-gray-500 hover:border-yellow-500/40'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-violet-500/60 resize-none mb-3 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={reviewMutation.isLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
                  >
                    {reviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm mb-3">Login to write a review</p>
                  <Link to="/login" className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all">
                    Login
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {inst.reviews?.length > 0 ? inst.reviews.map((review, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                          {review.userName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{review.userName}</p>
                          <StarRating rating={review.rating} size={11} showNumber={false} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed pl-12">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gray-900/80 border border-white/10 p-6 sticky top-24"
            >
              <h3 className="text-base font-bold text-white mb-4">Fees Structure</h3>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-gray-400 text-sm">Monthly</span>
                  <span className="text-xl font-bold text-green-400">{formatFees(inst.fees?.monthly)}</span>
                </div>
                {inst.fees?.annual > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 text-sm">Annual</span>
                    <span className="text-base font-semibold text-gray-300">{formatFees(inst.fees.annual)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (isInCart(inst._id)) {
                    setCartOpen(true)
                    return
                  }
                  const added = addToCart(inst)
                  if (added) {
                    toast.success('Added to cart!')
                    setCartOpen(true)
                  } else {
                    toast('Already in cart', { icon: '🛒' })
                    setCartOpen(true)
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-violet-500/20 hover:scale-[1.02] mb-3"
              >
                {isInCart(inst._id) ? '🛒 View Cart' : 'Add to Cart'}
              </button>
              <a
                href={`tel:${inst.phone}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all"
              >
                <FiPhone size={15} /> Call Now
              </a>

              {/* Extra info */}
              <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
                {inst.timing && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiClock size={14} className="text-violet-400 shrink-0" />
                    {inst.timing}
                  </div>
                )}
                {inst.address?.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiMapPin size={14} className="text-violet-400 shrink-0" />
                    {inst.address.sector}, {inst.address.city}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Apply Modal removed - now using Cart */}
    </div>
  )
}
