import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import test from './test';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/test', test);

export default routes;
