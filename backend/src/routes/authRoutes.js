import {Router} from 'express';import {registerUser,loginUser,me} from '../controllers/authController.js';import {authenticate} from '../middleware/auth.js';
const r=Router();r.post('/register',registerUser);r.post('/login',loginUser);r.get('/me',authenticate,me);export default r;
