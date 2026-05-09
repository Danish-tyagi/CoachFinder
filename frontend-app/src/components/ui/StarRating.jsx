import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function StarRating({ rating = 0, size = 14, showNumber = true }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="text-yellow-400" />)
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400" />)
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-gray-600" />)
    }
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showNumber && <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}
