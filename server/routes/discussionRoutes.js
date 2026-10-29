import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDiscussions,
  createDiscussion,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  toggleVoteDiscussion,
  incrementViewCount,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  toggleVoteAnswer,
  toggleAcceptAnswer,
} from '../controllers/discussionController.js';

const router = express.Router();

// Require JWT authentication for all discussion endpoints
router.use(protect);

router.route('/')
  .get(getDiscussions)
  .post(createDiscussion);

router.route('/:id')
  .get(getDiscussionById)
  .patch(updateDiscussion)
  .delete(deleteDiscussion);

router.post('/:id/vote', toggleVoteDiscussion);
router.post('/:id/view', incrementViewCount);

router.post('/:id/answers', addAnswer);
router.route('/:id/answers/:answerId')
  .patch(updateAnswer)
  .delete(deleteAnswer);

router.post('/:id/answers/:answerId/vote', toggleVoteAnswer);
router.post('/:id/answers/:answerId/accept', toggleAcceptAnswer);

export default router;

