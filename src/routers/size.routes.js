import { Router } from 'express';
import { sizeControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';

import { createSizeValidation, updateSizeValidation } from '../validations/size/index.js';

const router = Router();

// @Get
router.get('/all', sizeControllers.getAllSizes);
router.get('/:id', sizeControllers.getDetailedSize);

// @Post
router.post('/', authenticate, authorsize(ROLE.ADMIN), [createSizeValidation], sizeControllers.createSize);

// @Patch
router.patch('/:id', authenticate, authorsize(ROLE.ADMIN), [updateSizeValidation], sizeControllers.updateSize);

export default router;
