import {query} from '../config/db.js';
export const disputes={
 get:async id=>(await query(`SELECT d.*,m.tournament_id,m.org_id,m.team1_id,m.team2_id,m.score1,m.score2,m.status match_status FROM disputes d JOIN matches m ON m.id=d.match_id WHERE d.id=$1`,[id])).rows[0],
 forTournament:async tid=>(await query(`SELECT d.*,m.tournament_id,m.round,m.match_number,a.name team1_name,b.name team2_name,u.name raised_by_name FROM disputes d JOIN matches m ON m.id=d.match_id LEFT JOIN teams a ON a.id=m.team1_id LEFT JOIN teams b ON b.id=m.team2_id JOIN users u ON u.id=d.raised_by WHERE m.tournament_id=$1 ORDER BY d.created_at DESC`,[tid])).rows,
 create:async(matchId,userId,reason)=>(await query('INSERT INTO disputes(match_id,raised_by,reason,status) VALUES($1,$2,$3,\'OPEN\') RETURNING *',[matchId,userId,reason])).rows[0],
 resolve:async(id,userId,resolution)=>(await query('UPDATE disputes SET resolved_by=$2,resolution=$3,status=\'RESOLVED\',resolved_at=NOW() WHERE id=$1 RETURNING *',[id,userId,resolution])).rows[0]
};
