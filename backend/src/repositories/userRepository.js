import { query } from '../config/db.js';
export const users={
  findByEmail: async email=>(await query('SELECT * FROM users WHERE email=$1',[email])).rows[0],
  findById: async id=>(await query('SELECT id,name,email,created_at FROM users WHERE id=$1',[id])).rows[0],
  create: async ({name,email,passwordHash})=>(await query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,created_at',[name,email,passwordHash])).rows[0],
  memberships: async id=>(await query('SELECT m.org_id,m.role,o.name org_name,o.status FROM org_memberships m JOIN organizations o ON o.id=m.org_id WHERE m.user_id=$1 ORDER BY o.name',[id])).rows
};
