import {Router} from 'express';import {authenticate} from '../middleware/auth.js';import {list,read,readAll} from '../controllers/notificationController.js';
const r=Router();r.get('/',authenticate,list);r.patch('/:id/read',authenticate,read);r.patch('/read-all',authenticate,readAll);export default r;
