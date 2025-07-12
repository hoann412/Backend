import { Router } from 'express';
import { authControllers } from '../controllers/index.js';

const router = Router();

// @Post
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/sendVerify', authControllers.sendMailVerify);
router.post('/verifyEmail', authControllers.verifyEmail);
router.post('/resetPassword', authControllers.sendMailResetPassword);
export default router;
