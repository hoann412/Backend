import { Router } from 'express';
import { reviewControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';

const ReviewRouter = Router();

// Get
ReviewRouter.get('/all', authenticate, authorsize(ROLE.ADMIN), reviewControllers.getAllAdminReviews);
ReviewRouter.get('/all/:productId', reviewControllers.getAllReviewsProduct);
ReviewRouter.get('/rating/:productId', reviewControllers.getAllRatingProduct);

// Post
ReviewRouter.post('/create', authenticate, reviewControllers.createReview);

export default ReviewRouter;
