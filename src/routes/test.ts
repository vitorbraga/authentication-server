import { Router } from 'express';
import TestController from '../controllers/test-controller';

const router = Router();

router.get('/send-email', TestController.sendEmail);

export default router;
