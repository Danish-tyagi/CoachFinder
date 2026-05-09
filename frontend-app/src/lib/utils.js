// Haversine distance in km
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

export const formatFees = (amount) => {
  if (!amount) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCategoryColor = (category) => {
  const colors = {
    'IIT-JEE': 'from-orange-500 to-red-500',
    'NEET': 'from-green-500 to-emerald-500',
    'UPSC': 'from-blue-500 to-indigo-500',
    'Coding': 'from-violet-500 to-purple-500',
    'Language': 'from-pink-500 to-rose-500',
    'MBA': 'from-yellow-500 to-amber-500',
    'Banking': 'from-cyan-500 to-teal-500',
    'School Tuition': 'from-lime-500 to-green-500',
    'Commerce': 'from-sky-500 to-blue-500',
    'Arts': 'from-fuchsia-500 to-pink-500',
  };
  return colors[category] || 'from-gray-500 to-gray-600';
};

export const getCategoryBadgeColor = (category) => {
  const colors = {
    'IIT-JEE': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'NEET': 'bg-green-500/20 text-green-300 border-green-500/30',
    'UPSC': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Coding': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'Language': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'MBA': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Banking': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'School Tuition': 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    'Commerce': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'Arts': 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const CATEGORIES = [
  'All', 'IIT-JEE', 'NEET', 'UPSC', 'Coding', 'Language',
  'MBA', 'Banking', 'School Tuition', 'Commerce', 'Arts'
];

export const CATEGORY_ICONS = {
  'All': '🎓',
  'IIT-JEE': '⚛️',
  'NEET': '🧬',
  'UPSC': '🏛️',
  'Coding': '💻',
  'Language': '🌐',
  'MBA': '📊',
  'Banking': '🏦',
  'School Tuition': '📚',
  'Commerce': '💼',
  'Arts': '🎨',
};
