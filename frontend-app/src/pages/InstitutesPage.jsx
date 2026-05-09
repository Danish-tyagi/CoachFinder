import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';
import api from '../lib/api';
import InstituteCard from '../components/institutes/InstituteCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useLocation as useUserLocation } from '../context/LocationContext';
import { CATEGORIES, CATEGORY_ICONS } from '../lib/utils';

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'fees_low', label: 'Lowest Fees' },
  { value: 'fees_high', label: 'Highest Fees' },
  { value: 'nearest', label: 'Nearest First' },
  { value: 'newest', label: 'Newest' },
];

const RATING_OPTIONS = [3, 3.5, 4, 4.5];
const FEE_OPTIONS = [3000, 5000, 8000, 10000, 15000];
const DISTANCE_OPTIONS = [2, 5, 10, 20];

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4" role="img" aria-label="Search">🔍</div>
      <h3 className="text-xl font-bold text-white mb-2">No institutes found</h3>
      <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
      <button
        onClick={onClear}
        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
}

function PaginationBar({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl bg-gray-900/60 border border-white/10 text-gray-300 disabled:opacity-40 hover:border-violet-500/40 transition-all"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          aria-current={page === num ? 'page' : undefined}
          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
            page === num
              ? 'bg-violet-600 text-white'
              : 'bg-gray-900/60 border border-white/10 text-gray-400 hover:border-violet-500/40'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-xl bg-gray-900/60 border border-white/10 text-gray-300 disabled:opacity-40 hover:border-violet-500/40 transition-all"
      >
        Next
      </button>
    </div>
  );
}

export default function InstitutesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { location: userLocation } = useUserLocation();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'All');
  const [sortBy, setSortBy] = useState('default');
  const [minRating, setMinRating] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync URL with active filters
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category !== 'All') params.category = category;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, setSearchParams]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'institutes',
      debouncedSearch,
      category,
      sortBy,
      minRating,
      maxFees,
      maxDistance,
      page,
      userLocation?.lat,
      userLocation?.lng,
    ],
    queryFn: async () => {
      const params = {
        page,
        limit: 12,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== 'All' && { category }),
        ...(sortBy !== 'default' && { sortBy }),
        ...(minRating && { minRating }),
        ...(maxFees && { maxFees }),
        ...(maxDistance && { maxDistance }),
        ...(userLocation?.lat && { lat: userLocation.lat }),
        ...(userLocation?.lng && { lng: userLocation.lng }),
      };
      const { data } = await api.get('/institutes', { params });
      return data;
    },
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });

  const institutes = data?.data ?? [];
  const pagination = data?.pagination;

  const clearFilters = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('All');
    setSortBy('default');
    setMinRating('');
    setMaxFees('');
    setMaxDistance('');
    setPage(1);
  }, []);

  const hasActiveFilters =
    debouncedSearch || category !== 'All' || sortBy !== 'default' || minRating || maxFees || maxDistance;

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Coaching Institutes in <span className="gradient-text">Noida</span>
          </h1>
          <p className="text-gray-400">
            {pagination?.total ? `${pagination.total} institutes found` : 'Discover top coaching centers'}
          </p>
        </div>

        {/* Search + Sort + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institutes..."
              aria-label="Search institutes"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-900/80 border border-white/10 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-gray-500 outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setDebouncedSearch(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <FiX size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-3 rounded-xl bg-gray-900/80 border border-white/10 text-gray-300 outline-none focus:border-violet-500/60 transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'bg-gray-900/80 border-white/10 text-gray-300 hover:border-violet-500/40'
            }`}
          >
            <FiSliders size={16} aria-hidden="true" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-violet-400 rounded-full" aria-label="Active filters" />
            )}
          </button>
        </div>

        {/* Advanced filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-5 rounded-2xl bg-gray-900/60 border border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="min-rating" className="text-xs text-gray-400 mb-2 block">Min Rating</label>
                  <select
                    id="min-rating"
                    value={minRating}
                    onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-gray-300 outline-none text-sm"
                  >
                    <option value="" className="bg-gray-900">Any Rating</option>
                    {RATING_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-gray-900">{r}+ Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="max-fees" className="text-xs text-gray-400 mb-2 block">Max Fees (Monthly)</label>
                  <select
                    id="max-fees"
                    value={maxFees}
                    onChange={(e) => { setMaxFees(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-gray-300 outline-none text-sm"
                  >
                    <option value="" className="bg-gray-900">Any Fees</option>
                    {FEE_OPTIONS.map((f) => (
                      <option key={f} value={f} className="bg-gray-900">Up to ₹{f.toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="max-distance" className="text-xs text-gray-400 mb-2 block">Max Distance (km)</label>
                  <select
                    id="max-distance"
                    value={maxDistance}
                    onChange={(e) => { setMaxDistance(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-gray-300 outline-none text-sm"
                  >
                    <option value="" className="bg-gray-900">Any Distance</option>
                    {DISTANCE_OPTIONS.map((d) => (
                      <option key={d} value={d} className="bg-gray-900">Within {d} km</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={category === cat}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                category === cat
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-gray-900/60 border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-violet-300'
              }`}
            >
              <span aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : institutes.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${
                isFetching ? 'opacity-70' : 'opacity-100'
              }`}
            >
              {institutes.map((inst, i) => (
                <InstituteCard key={inst._id} institute={inst} index={i} />
              ))}
            </div>

            <PaginationBar
              page={page}
              totalPages={pagination?.pages ?? 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
