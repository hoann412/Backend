import { Router } from 'express';
import { categoryControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';
import { createCategoryValidation, updateCategoryValidation } from '../validations/category/index.js';

const router = Router();

// @Get
router.get('/all', categoryControllers.getAllCategories);
router.get('/:id', categoryControllers.getDetailedCategory);

// @Post
router.post('/', authenticate, authorsize(ROLE.ADMIN), [createCategoryValidation], categoryControllers.createCategory);

// @Patch
router.patch(
    '/:id',
    authenticate,
    authorsize(ROLE.ADMIN),
    [updateCategoryValidation],
    categoryControllers.updateCategory,
);

export default router;
