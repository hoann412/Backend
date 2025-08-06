import { Router } from 'express';
import { statsController } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';

const router = Router();

// router.use(authenticate)
// @Get
router.get('/total', authenticate, authorsize(ROLE.ADMIN), statsController.totalStats);
router.get('/daily', authenticate, authorsize(ROLE.ADMIN), statsController.orderByDayStats);
router.get('/monthly', authenticate, authorsize(ROLE.ADMIN), statsController.orderByMonthStats);
router.get('/yearly', authenticate, authorsize(ROLE.ADMIN), statsController.orderByYearStats);
router.get('/dateRange', authenticate, authorsize(ROLE.ADMIN), statsController.orderByDateRangeStats);
router.get('/productStats', authenticate, authorsize(ROLE.ADMIN), statsController.getProductStats);
router.get('/topBuyers', authenticate, authorsize(ROLE.ADMIN), statsController.getTop5Buyers);

export default router;
