import {Router} from 'express';import {authenticate,requireAdmin} from '../middleware/auth.js';import {stats,orgStatus} from '../controllers/adminController.js';
const r=Router();r.get('/stats',authenticate,requireAdmin,stats);r.patch('/organizations/:id/status',authenticate,requireAdmin,orgStatus);export default r;
