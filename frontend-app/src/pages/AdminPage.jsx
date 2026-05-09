import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import api from '../lib/api';
import { CATEGORIES, formatFees } from '../lib/utils';
import StarRating from '../components/ui/StarRating';
import CategoryBadge from '../components/ui/CategoryBadge';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'IIT-JEE',
  'fees.monthly': '',
  'fees.annual': '',
  latitude: '',
  longitude: '',
  'address.street': '',
  'address.sector': '',
  'address.pincode': '',
  phone: '',
  email: '',
  website: '',
  established: '',
  faculty: '',
  students: '',
  batchSize: '',
  timing: '',
  features: '',
  isFeatured: false,
  isVerified: false,
  'images.0.url': '',
};

// ── Form field component to reduce repetition ─────────────────────────────────
function FormField({ id, label, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-gray-400 mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-violet-500/60 text-sm transition-colors';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/institutes/admin/stats');
      return data.data;
    },
  });

  const { data: institutesData, isLoading } = useQuery({
    queryKey: ['admin-institutes'],
    queryFn: async () => {
      const { data } = await api.get('/institutes', { params: { limit: 50 } });
      return data;
    },
  });

  const institutes = institutesData?.data ?? [];

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/institutes', payload),
    onSuccess: () => {
      toast.success('Institute created!');
      queryClient.invalidateQueries({ queryKey: ['admin-institutes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/institutes/${id}`, payload),
    onSuccess: () => {
      toast.success('Institute updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-institutes'] });
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/institutes/${id}`),
    onSuccess: () => {
      toast.success('Institute deleted!');
      queryClient.invalidateQueries({ queryKey: ['admin-institutes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'Failed to delete'),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (inst) => {
    setEditingId(inst._id);
    setForm({
      name: inst.name ?? '',
      description: inst.description ?? '',
      category: inst.category ?? 'IIT-JEE',
      'fees.monthly': inst.fees?.monthly ?? '',
      'fees.annual': inst.fees?.annual ?? '',
      latitude: inst.latitude ?? '',
      longitude: inst.longitude ?? '',
      'address.street': inst.address?.street ?? '',
      'address.sector': inst.address?.sector ?? '',
      'address.pincode': inst.address?.pincode ?? '',
      phone: inst.phone ?? '',
      email: inst.email ?? '',
      website: inst.website ?? '',
      established: inst.established ?? '',
      faculty: inst.faculty ?? '',
      students: inst.students ?? '',
      batchSize: inst.batchSize ?? '',
      timing: inst.timing ?? '',
      features: inst.features?.join(', ') ?? '',
      isFeatured: inst.isFeatured ?? false,
      isVerified: inst.isVerified ?? false,
      'images.0.url': inst.images?.[0]?.url ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    fees: {
      monthly: Number(form['fees.monthly']),
      ...(form['fees.annual'] && { annual: Number(form['fees.annual']) }),
    },
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    address: {
      street: form['address.street'].trim(),
      sector: form['address.sector'].trim(),
      pincode: form['address.pincode'].trim(),
    },
    phone: form.phone.trim(),
    ...(form.email && { email: form.email.trim() }),
    ...(form.website && { website: form.website.trim() }),
    ...(form.established && { established: Number(form.established) }),
    faculty: Number(form.faculty) || 0,
    students: Number(form.students) || 0,
    ...(form.batchSize && { batchSize: Number(form.batchSize) }),
    ...(form.timing && { timing: form.timing.trim() }),
    features: form.features
      ? form.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [],
    isFeatured: form.isFeatured,
    isVerified: form.isVerified,
    images: form['images.0.url']
      ? [{ url: form['images.0.url'], caption: form.name }]
      : [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) return toast.error('Institute name is required');
    if (!form.latitude || !form.longitude) return toast.error('Latitude and longitude are required');
    if (!form['fees.monthly']) return toast.error('Monthly fees are required');

    const payload = buildPayload();
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // ── Stats config ───────────────────────────────────────────────────────────

  const STAT_CARDS = [
    { label: 'Total Institutes', value: stats?.totalInstitutes ?? 0, Icon: MdSchool, color: 'violet' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, Icon: FiStar, color: 'yellow' },
    { label: 'Avg Rating', value: stats?.avgRating ?? '0.0', Icon: FiTrendingUp, color: 'green' },
    { label: 'Categories', value: stats?.categoryStats?.length ?? 0, Icon: FiUsers, color: 'blue' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between py-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage CoachFinder institutes and content</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 hover:scale-105"
          >
            <FiPlus size={18} aria-hidden="true" /> Add Institute
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, Icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 flex items-center justify-center mb-3`}>
                <Icon className={`text-${color}-400`} size={20} aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Category breakdown */}
        {stats?.categoryStats?.length > 0 && (
          <div className="glass-dark rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Institutes by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {stats.categoryStats.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-sm text-gray-300">{cat._id}</span>
                  <span className="text-sm font-bold text-violet-400">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutes table */}
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">All Institutes ({institutes.length})</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Institute', 'Category', 'Rating', 'Fees', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {institutes.map((inst) => (
                    <tr key={inst._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={inst.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=60'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=60'; }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{inst.name}</p>
                            <p className="text-xs text-gray-500">{inst.address?.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={inst.category} />
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={inst.rating?.average ?? 0} size={12} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-green-400 font-semibold">
                          {formatFees(inst.fees?.monthly)}/mo
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {inst.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                              Featured
                            </span>
                          )}
                          {inst.isVerified && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(inst)}
                            className="p-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 transition-all"
                            aria-label={`Edit ${inst.name}`}
                          >
                            <FiEdit2 size={14} aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(inst._id, inst.name)}
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-all disabled:opacity-50"
                            aria-label={`Delete ${inst.name}`}
                          >
                            <FiTrash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/10 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="modal-title" className="text-xl font-bold text-white">
                  {editingId ? 'Edit Institute' : 'Add New Institute'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  aria-label="Close modal"
                >
                  <FiX size={20} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <FormField id="name" label="Institute Name" required className="sm:col-span-2">
                    <div className="sm:col-span-2">
                      <input
                        id="name" name="name" value={form.name} onChange={handleChange} required
                        className={INPUT_CLASS}
                      />
                    </div>
                  </FormField>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="text-xs text-gray-400 mb-1 block">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description" name="description" value={form.description}
                      onChange={handleChange} required rows={3}
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="text-xs text-gray-400 mb-1 block">Category <span className="text-red-400">*</span></label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} className={INPUT_CLASS}>
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c} className="bg-gray-900">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-xs text-gray-400 mb-1 block">Phone <span className="text-red-400">*</span></label>
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange} required className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="fees-monthly" className="text-xs text-gray-400 mb-1 block">Monthly Fees (₹) <span className="text-red-400">*</span></label>
                    <input id="fees-monthly" name="fees.monthly" type="number" min="0" value={form['fees.monthly']} onChange={handleChange} required className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="fees-annual" className="text-xs text-gray-400 mb-1 block">Annual Fees (₹)</label>
                    <input id="fees-annual" name="fees.annual" type="number" min="0" value={form['fees.annual']} onChange={handleChange} className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="latitude" className="text-xs text-gray-400 mb-1 block">Latitude <span className="text-red-400">*</span></label>
                    <input id="latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} required placeholder="28.5355" className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="longitude" className="text-xs text-gray-400 mb-1 block">Longitude <span className="text-red-400">*</span></label>
                    <input id="longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} required placeholder="77.3910" className={INPUT_CLASS} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address-street" className="text-xs text-gray-400 mb-1 block">Street Address <span className="text-red-400">*</span></label>
                    <input id="address-street" name="address.street" value={form['address.street']} onChange={handleChange} required className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="address-sector" className="text-xs text-gray-400 mb-1 block">Sector</label>
                    <input id="address-sector" name="address.sector" value={form['address.sector']} onChange={handleChange} className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="address-pincode" className="text-xs text-gray-400 mb-1 block">Pincode <span className="text-red-400">*</span></label>
                    <input id="address-pincode" name="address.pincode" value={form['address.pincode']} onChange={handleChange} required className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-xs text-gray-400 mb-1 block">Email</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="website" className="text-xs text-gray-400 mb-1 block">Website</label>
                    <input id="website" name="website" value={form.website} onChange={handleChange} className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="timing" className="text-xs text-gray-400 mb-1 block">Timing</label>
                    <input id="timing" name="timing" value={form.timing} onChange={handleChange} placeholder="Mon-Sat: 9AM-7PM" className={INPUT_CLASS} />
                  </div>

                  <div>
                    <label htmlFor="faculty" className="text-xs text-gray-400 mb-1 block">Faculty Count</label>
                    <input id="faculty" name="faculty" type="number" min="0" value={form.faculty} onChange={handleChange} className={INPUT_CLASS} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="image-url" className="text-xs text-gray-400 mb-1 block">Image URL</label>
                    <input id="image-url" name="images.0.url" value={form['images.0.url']} onChange={handleChange} placeholder="https://images.unsplash.com/..." className={INPUT_CLASS} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="features" className="text-xs text-gray-400 mb-1 block">Features (comma separated)</label>
                    <input id="features" name="features" value={form.features} onChange={handleChange} placeholder="Online Classes, Test Series, Study Material" className={INPUT_CLASS} />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox" name="isFeatured" id="isFeatured"
                        checked={form.isFeatured} onChange={handleChange}
                        className="w-4 h-4 accent-violet-600"
                      />
                      <span className="text-sm text-gray-300">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox" name="isVerified" id="isVerified"
                        checked={form.isVerified} onChange={handleChange}
                        className="w-4 h-4 accent-violet-600"
                      />
                      <span className="text-sm text-gray-300">Verified</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button" onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
