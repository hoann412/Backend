import { Router } from 'express';
import { userControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';

import upload from '../middleware/multerMiddleware.js';

const userRouter = Router();

// Get
userRouter.get('/profile', authenticate, userControllers.getProfile);
userRouter.get('/all', authenticate, authorsize(ROLE.ADMIN), userControllers.getAllUsers);
userRouter.get('/private/wish-list', authenticate, userControllers.getWishListByUser);

// Post

// Patch
userRouter.patch('/changePassword', authenticate, userControllers.changePassword);
userRouter.patch('/forgotPassword', authenticate, userControllers.forgotPassword);

userRouter.patch('/', authenticate, upload.fields([{ name: 'avatar', maxCount: 1 }]), userControllers.updateProfile);

userRouter.patch('/private/wish-list/add', authenticate, userControllers.addWishList);
userRouter.patch('/private/wish-list/remove', authenticate, userControllers.deleteWishList);

export default userRouter;
