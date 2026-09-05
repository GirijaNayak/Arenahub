import {register,login} from '../services/authService.js';import {users} from '../repositories/userRepository.js';
export const registerUser=async(req,res)=>res.status(201).json(await register(req.body));
export const loginUser=async(req,res)=>res.json(await login(req.body.email,req.body.password));
export const me=async(req,res)=>{const user=await users.findById(req.user.id);res.json({user,memberships:await users.memberships(req.user.id)})};
