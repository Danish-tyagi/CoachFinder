import { Link } from 'react-router-dom'
import { MdSchool } from 'react-icons/md'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

export default function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'All Institutes', to: '/institutes' },
    { label: 'Map View', to: '/map' },
    { label: 'Login', to: '/login' }
  ]

  const categories = ['IIT-JEE', 'NEET', 'UPSC', 'Coding', 'Language', 'MBA']

  return (
    <footer className="bg-gray-950 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* brand section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <MdSchool className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold gradient-text">CoachFinder</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Discover the best coaching institutes in Noida. Find IIT-JEE, NEET, UPSC, Coding, and more — all in one place.
            </p>

            {/* social links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-gray-400 hover:text-violet-300 transition-all"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-gray-400 hover:text-violet-300 transition-all"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-gray-400 hover:text-violet-300 transition-all"
              >
                <FiLinkedin size={16} />
              </a>
              <a
                href="mailto:contact@coachfinder.com"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-gray-400 hover:text-violet-300 transition-all"
              >
                <FiMail size={16} />
              </a>
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-violet-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/institutes?category=${cat}`}
                    className="text-gray-400 hover:text-violet-300 text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 CoachFinder. All rights reserved to Danish.</p>
          <p className="text-gray-500 text-sm">Made with ❤️ for students in Noida</p>
        </div>
      </div>
    </footer>
  )
}
