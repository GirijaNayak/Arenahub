import { verifyToken } from '../utils/jwt.js';
import { query } from '../config/db.js';
export function authenticate(req,res,next){
  try { const h=req.headers.authorization||''; if(!h.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'}); req.user=verifyToken(h.slice(7)); next(); }
  catch { return res.status(401).json({message:'Invalid or expired session token'}); }
}
export function requireRoles(...roles){ return async (req,res,next)=>{
  try { const orgId=req.params.orgId||req.params.id||req.body.orgId||req.query.orgId||req.user.orgId; if(!orgId) return res.status(400).json({message:'Organization context is required'});
    const r=await query('SELECT role FROM org_memberships WHERE user_id=$1 AND org_id=$2',[req.user.id,orgId]);
    if(!r.rows[0]) return res.status(403).json({message:'You are not a member of this organization'});
    if(!roles.includes(r.rows[0].role)) return res.status(403).json({message:'Insufficient role permissions'});
    req.orgId=orgId; req.role=r.rows[0].role; next();
  } catch(e){next(e)}
}; }
export function requireAdmin(req,res,next){ query('SELECT platform_admin FROM users WHERE id=$1',[req.user.id]).then(r=>{if(!r.rows[0]?.platform_admin)return res.status(403).json({message:'Platform Admin access required'});next()}).catch(next); }
