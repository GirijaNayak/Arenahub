import {query} from '../config/db.js';
export const tournaments={
 list:async orgId=>(await query('SELECT t.*, (SELECT COUNT(*) FROM teams tm WHERE tm.tournament_id=t.id) team_count FROM tournaments t WHERE t.org_id=$1 ORDER BY t.start_date DESC',[orgId])).rows,
 get:async id=>(await query('SELECT t.*,o.name org_name FROM tournaments t JOIN organizations o ON o.id=t.org_id WHERE t.id=$1',[id])).rows[0],
 create:async d=>(await query('INSERT INTO tournaments(org_id,name,format,max_teams,start_date,rules) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',d)).rows[0],
 update:async(id,d)=>(await query('UPDATE tournaments SET name=$2,max_teams=$3,start_date=$4,rules=$5 WHERE id=$1 RETURNING *',[id,d.name,d.maxTeams,d.startDate,d.rules])).rows[0],
 status:async(id,s)=>(await query('UPDATE tournaments SET status=$2 WHERE id=$1 RETURNING *',[id,s])).rows[0],
 teams:async id=>(await query('SELECT t.*,u.name captain_name,(SELECT COUNT(*) FROM team_members x WHERE x.team_id=t.id) player_count FROM teams t JOIN users u ON u.id=t.captain_id WHERE t.tournament_id=$1 ORDER BY t.seed NULLS LAST,t.name',[id])).rows
};
