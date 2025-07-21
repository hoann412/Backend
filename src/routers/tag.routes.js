import { Router } from 'express';
import { tagControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';

import { ROLE } from '../constants/role.js';

import { createTagValidation, updateTagValidation } from '../validations/tag/index.js';

const TagRouter = Router();

// Get
TagRouter.get('/all', tagControllers.getAllTag);
TagRouter.get('/:id', tagControllers.getDetailedTag);

// Post
TagRouter.post('/', authenticate, authorsize(ROLE.ADMIN), [createTagValidation], tagControllers.createTag);

// Patch
TagRouter.patch('/:id', authenticate, authorsize(ROLE.ADMIN), [updateTagValidation], tagControllers.updateTag);

export default TagRouter;
