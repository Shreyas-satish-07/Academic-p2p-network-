import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getResources,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  toggleLikeResource,
  toggleSaveResource,
  incrementViewCount,
} from '../controllers/resourceController.js';

const router = express.Router();

// Require JWT authentication for all resource endpoints
router.use(protect);

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResourceById)
  .patch(updateResource)
  .delete(deleteResource);

router.post('/:id/like', toggleLikeResource);
router.post('/:id/save', toggleSaveResource);
router.post('/:id/view', incrementViewCount);

export default router;

