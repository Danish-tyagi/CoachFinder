import { getCategoryBadgeColor, CATEGORY_ICONS } from '../../lib/utils'

export default function CategoryBadge({ category, size = 'sm' }) {
  const colorClass = getCategoryBadgeColor(category)
  const icon = CATEGORY_ICONS[category] || '🎓'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-medium ${colorClass} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <span>{icon}</span>
      {category}
    </span>
  )
}
