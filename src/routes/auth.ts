import { Router } from 'express';
import AuthController from '../controllers/auth-controller';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();
//Login route
router.post('/login', AuthController.login);

//Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword);

// Generate password recovery token
router.post('/password-recovery', [], AuthController.passwordRecoveryProcess);

router.post('/reset-password', [], AuthController.resetPassword);

router.get('/check-password-token/:token/:userId', [], AuthController.checkPasswordToken);

export default router;