import bcrypt from 'bcryptjs';
import {users} from '../repositories/userRepository.js';
import {signToken} from '../utils/jwt.js';
export async function register({name,email,password}){
 if(!name||!email||!password||password.length<8) throw Object.assign(new Error('Name, email and a password of at least 8 characters are required'),{status:400});
 if(await users.findByEmail(email)) throw Object.assign(new Error('Email is already registered'),{status:409});
 const hash=await bcrypt.hash(password,12); const user=await users.create({name,email,passwordHash:hash}); return {user:{...user,isAdmin:false},token:signToken({...user,isAdmin:false}),memberships:[]};
}
export async function login(email,password){const user=await users.findByEmail(email);if(!user||!(await bcrypt.compare(password,user.password_hash)))throw Object.assign(new Error('Invalid email or password'),{status:401});const safe={id:user.id,name:user.name,email:user.email,isAdmin:!!user.platform_admin};return {user:safe,token:signToken(safe),memberships:await users.memberships(user.id)};}
