import {notifications} from '../repositories/notificationRepository.js';
export const list=async(req,res)=>res.json(await notifications.list(req.user.id));
export const read=async(req,res)=>{const n=await notifications.read(req.params.id,req.user.id);if(!n)return res.status(404).json({message:'Notification not found'});res.json(n)};
export const readAll=async(req,res)=>{await notifications.readAll(req.user.id);res.json({ok:true})};
