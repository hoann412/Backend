import { Router } from 'express';
import { productControllers } from '../controllers/index.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';
import { authorsize } from '../middleware/authorizeMiddleware.js';
import { ROLE } from '../constants/role.js';
import upload from '../middleware/multerMiddleware.js';

const productRoutes = Router();

productRoutes.get('/all', productControllers.getAllProducts);
productRoutes.get('/best-selling', productControllers.getBestSellingProducts);
productRoutes.get('/discount', productControllers.getDiscountProducts);
productRoutes.get('/related/:id', productControllers.getRelatedProducts);
productRoutes.get('/:id', productControllers.getProductById);
productRoutes.get('/admin/:id', authenticate, authorsize(ROLE.ADMIN), productControllers.getProductByIdForAdmin);
productRoutes.put(
    '/update/:id',
    upload.fields([{ name: 'variantImages', maxCount: 10 }]),
    authenticate,
    authorsize(ROLE.ADMIN),
    productControllers.updateProduct,
);
productRoutes.post(
    '/create',
    upload.fields([{ name: 'variantImages', maxCount: 10 }]),
    authenticate,
    authorsize(ROLE.ADMIN),
    productControllers.createProduct,
);

productRoutes.patch('/hide/:id', authenticate, authorsize(ROLE.ADMIN), productControllers.hiddenProduct);
productRoutes.patch('/show/:id', authenticate, authorsize(ROLE.ADMIN), productControllers.showProduct);

export default productRoutes;
