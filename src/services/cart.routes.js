import { Router } from 'express';
import { cartControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';

const cartRouter = Router();
cartRouter.post('/add', authenticate, cartControllers.addToCart);
cartRouter.get('/my-cart', authenticate, cartControllers.getMyCart);
cartRouter.patch('/remove-item/:variantId', authenticate, cartControllers.removeCartItem);
cartRouter.patch('/remove-all', authenticate, cartControllers.removeAllCartItems);
cartRouter.post('/update-quantity', authenticate, cartControllers.updateCartItemQuantity);
export default cartRouter;
