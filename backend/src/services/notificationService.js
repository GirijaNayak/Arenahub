import {notifications} from '../repositories/notificationRepository.js';
import {query} from '../config/db.js';
export async function notifyUsers(userIds,message,io,orgId){
  const unique=[...new Set(userIds.filter(Boolean))];
  for(const uid of unique){const n=await notifications.create(uid,message); if(io&&orgId) io.to(`org:${orgId}`).emit('notification:new',n);}
}
export async function notifyTournamentCaptains(tournamentId,message,io,orgId){
 const r=await query(`SELECT DISTINCT captain_id FROM teams WHERE tournament_id=$1`,[tournamentId]);
 return notifyUsers(r.rows.map(x=>x.captain_id),message,io,orgId);
}
