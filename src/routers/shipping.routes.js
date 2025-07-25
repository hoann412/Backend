import { Router } from 'express';
import { shippingController } from '../controllers/index.js';

const router = Router();

router.get('/get-province', shippingController.getProvince);
router.get('/get-district', shippingController.getDistrict);
router.get('/get-ward', shippingController.getWard);
router.get('/get-service', shippingController.getService);
router.get('/calculate-shipping-fee', shippingController.calculateShippingFee);
router.get('/get-pick-shift', shippingController.getPickShift);
router.post('/create-order', shippingController.createOrder);

export default router;
