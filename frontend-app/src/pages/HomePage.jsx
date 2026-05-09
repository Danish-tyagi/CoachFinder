import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiMapPin, FiTrendingUp, FiAward, FiArrowRight } from 'react-icons/fi'
import { MdSchool } from 'react-icons/md'
import api from '../lib/api'
import InstituteCard from '../components/institutes/InstituteCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { CATEGORIES, CATEGORY_ICONS } from '../lib/utils'

/* ── Animated counter ── */
function Counter({ to, duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) motionVal.set(to)
  }, [inView, to, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)))
  }, [spring])

  return <span ref={ref}>{display.toLocaleString()}</span>
}

/* ── Floating particle ── */
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: style.duration,
        repeat: Infinity,
        delay: style.delay,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ── Typewriter ── */
const WORDS = ['IIT-JEE', 'NEET', 'UPSC', 'Coding', 'MBA', 'Banking']
function Typewriter() {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[idx]
    let timeout

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIdx((i) => (i + 1) % WORDS.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, idx])

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

/* ── Particles config ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  width: Math.random() * 6 + 2,
  height: Math.random() * 6 + 2,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  background: i % 3 === 0
    ? 'rgba(139,92,246,0.6)'
    : i % 3 === 1
    ? 'rgba(96,165,250,0.5)'
    : 'rgba(52,211,153,0.4)',
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}))

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const fadeScale = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => {
      const { data } = await api.get('/institutes/featured')
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/institutes?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative hero-gradient pt-28 pb-24 px-4 overflow-hidden">

        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p, i) => <Particle key={i} style={p} />)}
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Trusted by 10,000+ students in Noida</span>
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight"
            >
              Find the Best
            </motion.h1>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight min-h-[1.2em]"
            >
              <Typewriter />
            </motion.h1>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            >
              Coaching in Noida
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Compare fees, ratings, and locations of top coaching centers — all in one place.
            </motion.p>

            {/* Search */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-10"
            >
              <motion.div
                className="relative group"
                animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <FiSearch
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-violet-400' : 'text-gray-400'}`}
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search institutes, courses, locations..."
                  className="w-full pl-14 pr-36 py-4 rounded-2xl bg-gray-900/80 border border-white/10 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-gray-500 outline-none transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/30"
                >
                  Search
                </motion.button>
              </motion.div>
            </motion.form>

            {/* Stats */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { icon: MdSchool, value: 500, suffix: '+', label: 'Institutes', color: 'violet' },
                { icon: FiAward, value: 10000, suffix: '+', label: 'Students', color: 'blue' },
                { icon: FiMapPin, value: 20, suffix: '+', label: 'Locations', color: 'green' },
                { icon: FiTrendingUp, value: 98, suffix: '%', label: 'Satisfaction', color: 'yellow' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeScale}
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="glass rounded-2xl p-4 cursor-default"
                >
                  <stat.icon className={`text-${stat.color}-400 mx-auto mb-2`} size={22} />
                  <p className="text-2xl font-bold text-white">
                    <Counter to={stat.value} />{stat.suffix}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════
          CATEGORIES
      ══════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-3 block">Explore</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Browse by Category</h2>
            <p className="text-gray-400">Find coaching institutes for your specific needs</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => c !== 'All').map((category, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <Link
                  to={`/institutes?category=${category}`}
                  className="block p-5 rounded-2xl glass hover:bg-white/10 hover:border-violet-500/50 border border-white/10 transition-all group text-center relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-blue-600/0 group-hover:from-violet-600/10 group-hover:to-blue-600/10 transition-all duration-300 rounded-2xl" />
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300 relative z-10">
                    {CATEGORY_ICONS[category]}
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors relative z-10">
                    {category}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section className="py-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #030712 0%, #0d0d1f 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-3 block">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-violet-600/50 via-blue-500/50 to-violet-600/50" />

            {[
              { step: '01', icon: '🔍', title: 'Search', desc: 'Enter your course or location to find matching institutes instantly.' },
              { step: '02', icon: '📊', title: 'Compare', desc: 'Compare fees, ratings, faculty, and facilities side by side.' },
              { step: '03', icon: '🎯', title: 'Enroll', desc: 'Contact the institute directly and start your journey.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="relative text-center p-6 rounded-2xl glass border border-white/10 hover:border-violet-500/40 transition-all"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/40">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURED INSTITUTES
      ══════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-3 block">Top Picks</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Institutes</h2>
              <p className="text-gray-400">Top-rated coaching centers in Noida</p>
            </div>
            <motion.div whileHover={{ x: 4 }}>
              <Link
                to="/institutes"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-violet-300 font-medium transition-all text-sm"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featured?.slice(0, 6).map((inst, i) => (
                <motion.div key={inst._id} variants={fadeUp}>
                  <InstituteCard institute={inst} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/institutes"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25"
              >
                Explore All Institutes <FiArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA
      ══════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #0c1a2e 100%)' }}
      >
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((r) => (
            <motion.div
              key={r}
              className="absolute rounded-full border border-violet-500/10"
              style={{ width: r * 280, height: r * 280 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + r, repeat: Infinity, delay: r * 0.5 }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-5xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎓
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to Find Your<br />
              <span className="gradient-text">Perfect Institute?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of students who found their ideal coaching center through CoachFinder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/institutes"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-violet-500/30"
                >
                  Browse Institutes <FiArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/map"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold text-base transition-all"
                >
                  <FiMapPin size={16} /> View on Map
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
