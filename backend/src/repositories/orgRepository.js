import {query} from '../config/db.js';
export const orgs={
 list:async()=> (await query('SELECT * FROM organizations ORDER BY created_at DESC')).rows,
 get:async id=>(await query('SELECT * FROM organizations WHERE id=$1',[id])).rows[0],
 create:async name=>(await query('INSERT INTO organizations(name) VALUES($1) RETURNING *',[name])).rows[0],
 addMember:async(orgId,userId,role)=>(await query('INSERT INTO org_memberships(org_id,user_id,role) VALUES($1,$2,$3) ON CONFLICT(user_id,org_id) DO UPDATE SET role=EXCLUDED.role RETURNING *',[orgId,userId,role])).rows[0],
 members:async orgId=>(await query('SELECT u.id,u.name,u.email,m.role,m.joined_at FROM org_memberships m JOIN users u ON u.id=m.user_id WHERE m.org_id=$1 ORDER BY u.name',[orgId])).rows
};
