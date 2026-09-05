import {query} from '../config/db.js';
export const matches={
 list:async tid=>(await query(`SELECT m.*,a.name team1_name,b.name team2_name,w.name winner_name FROM matches m LEFT JOIN teams a ON a.id=m.team1_id LEFT JOIN teams b ON b.id=m.team2_id LEFT JOIN teams w ON w.id=m.winner_id WHERE m.tournament_id=$1 ORDER BY m.round,m.match_number`,[tid])).rows,
 get:async id=>(await query(`SELECT m.*,a.name team1_name,b.name team2_name,tr.org_id,tr.status tournament_status,tr.name tournament_name FROM matches m JOIN tournaments tr ON tr.id=m.tournament_id LEFT JOIN teams a ON a.id=m.team1_id LEFT JOIN teams b ON b.id=m.team2_id WHERE m.id=$1`,[id])).rows[0],
 create:async d=>(await query('INSERT INTO matches(tournament_id,round,match_number,team1_id,team2_id,status,scheduled_at,next_match_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',d)).rows[0],
 update:async(id,fields)=>{const cols=Object.keys(fields);const vals=Object.values(fields);const set=cols.map((c,i)=>`${c}=$${i+2}`).join(',');return (await query(`UPDATE matches SET ${set} WHERE id=$1 RETURNING *`,[id,...vals])).rows[0]},
 setNextTeam:async(nextId,slot,teamId)=> query(`UPDATE matches SET ${slot}=$2 WHERE id=$1`,[nextId,teamId])
};
