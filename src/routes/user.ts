import { Router } from 'express';
import UserController from '../controllers/user-controller';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole(['ADMIN'])], UserController.listAll);

// Get one user
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN', 'USER'])], UserController.getOneById);

// Create a new user
router.post('/', UserController.newUser);

// Edit one user
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['USER'])], UserController.updateUser);

// Delete one user
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], UserController.deleteUser);

export default router;
