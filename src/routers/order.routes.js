import { Router } from 'express';
import { orderControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';
import { transactionMiddleware } from '../middleware/transaction.js';

const orderRouter = Router();
orderRouter.post('/create', authenticate, transactionMiddleware, orderControllers.createOrder);
orderRouter.patch('/cancel', authenticate, orderControllers.cancelOrder);
orderRouter.patch('/confirm', authenticate, orderControllers.confirmOrder);
orderRouter.patch('/shipping', authenticate, orderControllers.shippingOrder);
orderRouter.patch('/done', authenticate, orderControllers.finishOrder);
orderRouter.patch('/delivered', authenticate, orderControllers.deliverOrder);
orderRouter.get('/my-order', authenticate, orderControllers.getAllOrdersByUser);
orderRouter.get('/all', authenticate, authorsize(ROLE.ADMIN), orderControllers.getAllOrders);
orderRouter.get('/details/:id', authenticate, orderControllers.getDetailedOrder);

export default orderRouter;
