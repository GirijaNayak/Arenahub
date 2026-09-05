import bcrypt from 'bcryptjs';import {query} from '../config/db.js';
export async function seedDemo(){
 const hash=await bcrypt.hash('Password123!',10);
 const demo=[['Platform Admin','admin@arenahub.local',true],['Aarav Organizer','organizer@campus.local',false],['Riya Captain','captain1@campus.local',false],['Kabir Captain','captain2@campus.local',false],['Neha Referee','referee@campus.local',false],['Dev Player','player@campus.local',false]];
 for(const [name,email,admin] of demo) await query('INSERT INTO users(name,email,password_hash,platform_admin) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO UPDATE SET platform_admin=EXCLUDED.platform_admin',[name,email,hash,admin]);
 const org=(await query("INSERT INTO organizations(name) VALUES('Campus Gamers Club') ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING id")).rows[0];
 const roles=[['organizer@campus.local','TOURNAMENT_ORGANIZER'],['captain1@campus.local','TEAM_CAPTAIN'],['captain2@campus.local','TEAM_CAPTAIN'],['referee@campus.local','REFEREE'],['player@campus.local','PLAYER']];
 for(const [email,role] of roles){const u=(await query('SELECT id FROM users WHERE email=$1',[email])).rows[0];await query('INSERT INTO org_memberships(user_id,org_id,role) VALUES($1,$2,$3) ON CONFLICT(user_id,org_id) DO UPDATE SET role=EXCLUDED.role',[u.id,org.id,role]);}
}
