import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiArrowRight } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import StarRating from '../ui/StarRating'
import CategoryBadge from '../ui/CategoryBadge'
import { formatFees } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

export default function InstituteCard({ institute, index = 0 }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleViewDetails = (e) => {
    if (!user) {
      e.preventDefault()
      navigate('/login', { state: { from: `/institutes/${institute._id}` } })
    }
  }
  const img = institute.images?.[0]?.url || `https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={institute.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <CategoryBadge category={institute.category} />
        </div>
        {institute.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-500/90 text-yellow-950 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Featured
          </div>
        )}
        {institute.distance !== undefined && (
          <div className="absolute bottom-3 right-3 glass text-xs text-white px-2 py-1 rounded-full flex items-center gap-1">
            <FiMapPin size={10} /> {institute.distance} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name & Verified */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-violet-300 transition-colors">
            {institute.name}
          </h3>
          {institute.isVerified && (
            <MdVerified className="text-blue-400 shrink-0 mt-0.5" size={18} />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={institute.rating?.average || 0} size={13} />
          <span className="text-xs text-gray-500">({institute.rating?.count || 0} reviews)</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-gray-400 text-xs mb-3">
          <FiMapPin size={12} className="mt-0.5 shrink-0 text-violet-400" />
          <span className="line-clamp-1">{institute.address?.fullAddress || institute.address?.street}</span>
        </div>

        {/* Fees */}
        <div className="flex items-center gap-1.5 text-gray-300 text-sm mb-4">
          <HiOutlineCurrencyRupee size={16} className="text-green-400" />
          <span className="font-semibold text-green-400">{formatFees(institute.fees?.monthly)}</span>
          <span className="text-gray-500 text-xs">/month</span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={`/institutes/${institute._id}`}
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-blue-600/20 hover:from-violet-600 hover:to-blue-600 border border-violet-500/30 hover:border-transparent text-violet-300 hover:text-white text-sm font-semibold transition-all duration-300 group/btn"
          >
            View Details
            <FiArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
