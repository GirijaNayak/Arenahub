import {query} from '../config/db.js';
export const teams={
 create:async(tournamentId,captainId,name)=>(await query('INSERT INTO teams(tournament_id,captain_id,name,seed) SELECT $1,$2,$3,COALESCE(MAX(seed),0)+1 FROM teams WHERE tournament_id=$1 RETURNING *',[tournamentId,captainId,name])).rows[0],
 get:async id=>(await query('SELECT t.*,tr.org_id,tr.status tournament_status FROM teams t JOIN tournaments tr ON tr.id=t.tournament_id WHERE t.id=$1',[id])).rows[0],
 members:async id=>(await query('SELECT u.id,u.name,u.email,tm.joined_at FROM team_members tm JOIN users u ON u.id=tm.user_id WHERE tm.team_id=$1 ORDER BY u.name',[id])).rows,
 addPlayer:async(id,userId)=>(await query('INSERT INTO team_members(team_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING *',[id,userId])).rows[0],
 removePlayer:async(id,userId)=>query('DELETE FROM team_members WHERE team_id=$1 AND user_id=$2',[id,userId])
};
