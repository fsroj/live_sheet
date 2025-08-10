const express = require('express');
const {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  addSegment,
  updateSegment,
  deleteSegment,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas protegidas
router.use(protect);

router
  .route('/')
  .post(authorize('professor', 'admin'), createLesson)
  .get(getLessons);

router
  .route('/:id')
  .get(getLesson)
  .put(authorize('professor', 'admin'), updateLesson)
  .delete(authorize('professor', 'admin'), deleteLesson);

router
  .route('/:id/segments')
  .post(authorize('professor', 'admin'), addSegment);

router
  .route('/:id/segments/:segmentId')
  .put(authorize('professor', 'admin'), updateSegment)
  .delete(authorize('professor', 'admin'), deleteSegment);

module.exports = router;