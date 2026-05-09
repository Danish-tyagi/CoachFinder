const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const instituteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: true,
      enum: ['IIT-JEE', 'NEET', 'UPSC', 'Coding', 'Language', 'MBA', 'Banking', 'School Tuition', 'Commerce', 'Arts']
    },
    fees: {
      monthly: { type: Number, required: true },
      annual: { type: Number },
      currency: { type: String, default: 'INR' }
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String }
      }
    ],
    // for geo queries
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: {
      street: { type: String, required: true },
      sector: { type: String },
      city: { type: String, default: 'Noida' },
      state: { type: String, default: 'Uttar Pradesh' },
      pincode: { type: String, required: true },
      fullAddress: { type: String }
    },
    phone: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    established: { type: Number },
    faculty: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    batchSize: { type: Number },
    timing: { type: String },
    features: [{ type: String }],
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

instituteSchema.index({ location: '2dsphere' });
instituteSchema.index({ category: 1, 'rating.average': -1 });
instituteSchema.index({ name: 'text', description: 'text' });

// build full address string before saving
instituteSchema.pre('save', function (next) {
  const a = this.address;
  this.address.fullAddress = [a.street, a.sector, a.city, a.state, a.pincode]
    .filter(Boolean)
    .join(', ');

  this.location = {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };

  next();
});

module.exports = mongoose.model('Institute', instituteSchema);
