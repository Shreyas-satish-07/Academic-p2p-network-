import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getStudyGroups,
  createStudyGroup,
  getStudyGroupById,
  updateStudyGroup,
  deleteStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
} from '../controllers/studyGroupController.js';

const router = express.Router();

// Apply JWT protection across all study group routes
router.use(protect);

router.route('/')
  .get(getStudyGroups)
  .post(createStudyGroup);

router.route('/:id')
  .get(getStudyGroupById)
  .patch(updateStudyGroup)
  .delete(deleteStudyGroup);

router.post('/:id/join', joinStudyGroup);
router.post('/:id/leave', leaveStudyGroup);

export default router;

