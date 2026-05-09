const Institute = require('../models/Institute');

// calculate distance between two coordinates (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getInstitutes = async (req, res) => {
  try {
    const { search, category, minRating, minFees, maxFees, sortBy, page = 1, limit = 12, lat, lng, maxDistance } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (minFees || maxFees) {
      query['fees.monthly'] = {};
      if (minFees) query['fees.monthly'].$gte = parseInt(minFees);
      if (maxFees) query['fees.monthly'].$lte = parseInt(maxFees);
    }

    // sorting
    let sort = { isFeatured: -1, 'rating.average': -1 };
    if (sortBy === 'rating') sort = { 'rating.average': -1 };
    else if (sortBy === 'fees_low') sort = { 'fees.monthly': 1 };
    else if (sortBy === 'fees_high') sort = { 'fees.monthly': -1 };
    else if (sortBy === 'newest') sort = { createdAt: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Institute.countDocuments(query);
    let institutes = await Institute.find(query).sort(sort).skip(skip).limit(limitNum).select('-reviews').lean();

    // add distance if user location provided
    if (lat && lng) {
      institutes = institutes.map((inst) => {
        const dist = getDistance(parseFloat(lat), parseFloat(lng), inst.latitude, inst.longitude);
        return { ...inst, distance: parseFloat(dist.toFixed(1)) };
      });

      if (maxDistance) {
        institutes = institutes.filter((i) => i.distance <= parseFloat(maxDistance));
      }

      if (sortBy === 'nearest') {
        institutes.sort((a, b) => a.distance - b.distance);
      }
    }

    res.json({
      success: true,
      data: institutes,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (err) {
    console.log('getInstitutes error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getInstitute = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).populate('reviews.user', 'name avatar');

    if (!institute || !institute.isActive) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    res.json({ success: true, data: institute });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get institute' });
  }
};

const createInstitute = async (req, res) => {
  try {
    const institute = await Institute.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: institute });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    res.json({ success: true, data: institute });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    // soft delete
    const institute = await Institute.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    res.json({ success: true, message: 'Institute deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

const getFeatured = async (req, res) => {
  try {
    const institutes = await Institute.find({ isFeatured: true, isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .select('-reviews')
      .lean();

    res.json({ success: true, data: institutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get featured institutes' });
  }
};

const getMapInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find({ isActive: true })
      .select('name category latitude longitude rating fees address images')
      .lean();

    res.json({ success: true, data: institutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get institutes for map' });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    // check if already reviewed
    const alreadyReviewed = institute.reviews.find(
      (r) => r.user && r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You already reviewed this institute' });
    }

    institute.reviews.push({
      user: req.user._id,
      userName: req.user.name,
      rating: parseInt(rating),
      comment: comment.trim()
    });

    // recalculate average rating
    const total = institute.reviews.reduce((sum, r) => sum + r.rating, 0);
    institute.rating.average = parseFloat((total / institute.reviews.length).toFixed(1));
    institute.rating.count = institute.reviews.length;

    await institute.save();

    res.status(201).json({ success: true, data: institute });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }

    const reviewIndex = institute.reviews.findIndex(
      (r) => r._id.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    institute.reviews.splice(reviewIndex, 1);

    // update rating after delete
    if (institute.reviews.length > 0) {
      const total = institute.reviews.reduce((sum, r) => sum + r.rating, 0);
      institute.rating.average = parseFloat((total / institute.reviews.length).toFixed(1));
      institute.rating.count = institute.reviews.length;
    } else {
      institute.rating.average = 0;
      institute.rating.count = 0;
    }

    await institute.save();

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalInstitutes = await Institute.countDocuments({ isActive: true });

    // get total reviews count
    const reviewsData = await Institute.aggregate([
      { $match: { isActive: true } },
      { $project: { reviewCount: { $size: '$reviews' } } },
      { $group: { _id: null, total: { $sum: '$reviewCount' } } }
    ]);

    const categoryData = await Institute.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ratingData = await Institute.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: '$rating.average' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalInstitutes,
        totalReviews: reviewsData[0] ? reviewsData[0].total : 0,
        categoryStats: categoryData,
        avgRating: ratingData[0] ? parseFloat(ratingData[0].avg.toFixed(1)) : 0
      }
    });
  } catch (err) {
    console.log('stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

module.exports = {
  getInstitutes,
  getInstitute,
  createInstitute,
  updateInstitute,
  deleteInstitute,
  getFeatured,
  getMapInstitutes,
  addReview,
  deleteReview,
  getAdminStats
};
