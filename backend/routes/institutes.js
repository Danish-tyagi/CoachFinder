const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/instituteController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/featured', getFeatured);
router.get('/map', getMapInstitutes);
router.get('/admin/stats', protect, adminOnly, getAdminStats);

router.route('/')
  .get(getInstitutes)
  .post(protect, adminOnly, createInstitute);

router.route('/:id')
  .get(getInstitute)
  .put(protect, adminOnly, updateInstitute)
  .delete(protect, adminOnly, deleteInstitute);

router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, adminOnly, deleteReview);

module.exports = router;
