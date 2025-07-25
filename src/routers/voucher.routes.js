import { Router } from 'express';
import { createVoucher, getAllVoucher, getAllVoucherForAdmin, getVoucherDetails, updateVoucher, updateVoucherStatus } from '../controllers/voucher.controllers.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';

const voucherRouter = Router();

voucherRouter.post('/create', authenticate, createVoucher);
voucherRouter.put('/update/:id', authenticate, updateVoucher);
voucherRouter.get('/details/:id', authenticate, getVoucherDetails);
voucherRouter.patch('/update-status/:id', authenticate, updateVoucherStatus);
voucherRouter.get('/all', authenticate, getAllVoucher);
voucherRouter.get('/admin/all', authenticate, getAllVoucherForAdmin);

export default voucherRouter;
