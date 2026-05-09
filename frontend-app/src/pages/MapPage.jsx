import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { FiX, FiMapPin, FiNavigation } from 'react-icons/fi'
import api from '../lib/api'
import { useLocation as useUserLocation } from '../context/LocationContext'
import StarRating from '../components/ui/StarRating'
import CategoryBadge from '../components/ui/CategoryBadge'
import { formatFees, CATEGORIES, CATEGORY_ICONS } from '../lib/utils'
import 'leaflet/dist/leaflet.css'

// Leaflet default icon fix (webpack/vite issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom violet marker
const createCustomIcon = (isSelected = false) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${isSelected ? '#7c3aed' : '#8b5cf6'};
      border: 3px solid ${isSelected ? '#fff' : '#c4b5fd'};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(139,92,246,0.6);
      transition: all 0.2s;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })

// User location marker
const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px; height: 16px;
    background: #3b82f6;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Fly to location helper
function FlyToLocation({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 13, { duration: 1.2 })
  }, [lat, lng, map])
  return null
}

export default function MapPage() {
  const { location: userLocation, requestLocation } = useUserLocation()
  const [selectedInstitute, setSelectedInstitute] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [flyTo, setFlyTo] = useState(null)

  const { data: institutes = [], isLoading } = useQuery({
    queryKey: ['map-institutes'],
    queryFn: async () => {
      const { data } = await api.get('/institutes/map')
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const filtered = filterCategory === 'All'
    ? institutes
    : institutes.filter(i => i.category === filterCategory)

  const centerLat = 28.5355
  const centerLng = 77.3910

  const handleSelectInstitute = (inst) => {
    setSelectedInstitute(inst)
    setFlyTo({ lat: inst.latitude, lng: inst.longitude })
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Map View</h1>
            <p className="text-gray-400 text-sm">{filtered.length} institutes in Noida</p>
          </div>
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-sm font-medium transition-all"
          >
            <FiNavigation size={14} /> My Location
          </button>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                filterCategory === cat
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-gray-900/60 border-white/10 text-gray-400 hover:border-violet-500/40'
              }`}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Sidebar */}
        <div className="w-72 shrink-0 border-r border-white/10 overflow-y-auto bg-gray-950 hidden md:block">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No institutes found</div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((inst) => (
                <button
                  key={inst._id}
                  onClick={() => handleSelectInstitute(inst)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedInstitute?._id === inst._id
                      ? 'bg-violet-600/20 border-violet-500/40'
                      : 'bg-gray-900/60 border-white/10 hover:border-violet-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={inst.images?.[0]?.url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100'}
                      alt={inst.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100' }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1">{inst.name}</p>
                      <CategoryBadge category={inst.category} />
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRating rating={inst.rating?.average || 0} size={10} showNumber={false} />
                        <span className="text-xs text-gray-500">{inst.rating?.average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Fly to selected */}
            {flyTo && <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} />}

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <div className="text-sm font-semibold">📍 Your Location</div>
                </Popup>
              </Marker>
            )}

            {/* Institute markers */}
            {filtered.map((inst) => (
              inst.latitude && inst.longitude ? (
                <Marker
                  key={inst._id}
                  position={[inst.latitude, inst.longitude]}
                  icon={createCustomIcon(selectedInstitute?._id === inst._id)}
                  eventHandlers={{
                    click: () => handleSelectInstitute(inst),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '180px' }}>
                      <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{inst.name}</p>
                      <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{inst.category}</p>
                      <p style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                        ₹{inst.fees?.monthly?.toLocaleString()}/mo
                      </p>
                      <a
                        href={`/institutes/${inst._id}`}
                        style={{
                          display: 'block', marginTop: '8px', padding: '4px 8px',
                          background: '#7c3aed', color: '#fff', borderRadius: '6px',
                          textAlign: 'center', fontSize: '12px', textDecoration: 'none'
                        }}
                      >
                        View Details
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>

          {/* Selected Institute Bottom Card */}
          <AnimatePresence>
            {selectedInstitute && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 z-[1000] rounded-2xl p-4 shadow-2xl pointer-events-auto"
                style={{ background: 'rgba(15,10,30,0.95)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                <button
                  onClick={() => setSelectedInstitute(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <FiX size={16} />
                </button>
                <div className="flex gap-3">
                  <img
                    src={selectedInstitute.images?.[0]?.url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100'}
                    alt={selectedInstitute.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100' }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm line-clamp-1">{selectedInstitute.name}</h3>
                    <CategoryBadge category={selectedInstitute.category} />
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={selectedInstitute.rating?.average || 0} size={11} showNumber={false} />
                      <span className="text-xs text-green-400 font-semibold">
                        {formatFees(selectedInstitute.fees?.monthly)}/mo
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/institutes/${selectedInstitute._id}`}
                  className="mt-3 w-full flex items-center justify-center py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-blue-500 transition-all"
                >
                  View Details
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
