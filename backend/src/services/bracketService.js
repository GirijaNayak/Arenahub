import {query,pool} from '../config/db.js';
import {matches} from '../repositories/matchRepository.js';
import {notifyTournamentCaptains} from './notificationService.js';

export function nextPowerOfTwo(n){let p=1;while(p<n)p*=2;return p;}

function bracketSeedPositions(size){
 let positions=[0,1];
 while(positions.length<size){const n=positions.length*2;positions=positions.flatMap(p=>[p,n-1-p]);}
 return positions;
}

export async function generateBracket(tournamentId,io,orgId){
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const teamsRes=await client.query('SELECT * FROM teams WHERE tournament_id=$1 ORDER BY seed NULLS LAST,name',[tournamentId]);
  if(teamsRes.rows.length<2) throw Object.assign(new Error('At least two registered teams are required'),{status:400});
  const existing=await client.query('SELECT COUNT(*) FROM matches WHERE tournament_id=$1',[tournamentId]);
  if(Number(existing.rows[0].count)>0) throw Object.assign(new Error('Bracket has already been generated'),{status:409});
  const slots=nextPowerOfTwo(teamsRes.rows.length);
  const seeded=teamsRes.rows;
  const seedPositions = bracketSeedPositions(slots);
  const slotsArr=Array(slots).fill(null); seeded.forEach((t,i)=>{slotsArr[seedPositions[i]]=t.id});
  const rounds=Math.log2(slots); const roundMatchIds={};
  for(let r=1;r<=rounds;r++) roundMatchIds[r]=[];
  for(let r=1;r<=rounds;r++){
    const count=slots/(2**r);
    for(let m=1;m<=count;m++){
      const team1=r===1?slotsArr[(m-1)*2]:null, team2=r===1?slotsArr[(m-1)*2+1]:null;
      const row=await client.query(`INSERT INTO matches(tournament_id,round,match_number,team1_id,team2_id,status) VALUES($1,$2,$3,$4,$5,'SCHEDULED') RETURNING id`,[tournamentId,r,m,team1,team2]);
      roundMatchIds[r].push(row.rows[0].id);
    }
  }
  for(let r=1;r<rounds;r++) for(let i=0;i<roundMatchIds[r].length;i++){
    const next=roundMatchIds[r+1][Math.floor(i/2)]; await client.query('UPDATE matches SET next_match_id=$2 WHERE id=$1',[roundMatchIds[r][i],next]);
  }
  // Handle first-round byes. A one-team match immediately advances that team.
  const first=await client.query('SELECT * FROM matches WHERE tournament_id=$1 AND round=1 ORDER BY match_number',[tournamentId]);
  for(const m of first.rows){
   if(m.team1_id && !m.team2_id){ await client.query("UPDATE matches SET winner_id=$2,status='CONFIRMED' WHERE id=$1",[m.id,m.team1_id]); await advanceWithClient(client,m.id,m.team1_id); }
   if(!m.team1_id && m.team2_id){ await client.query("UPDATE matches SET winner_id=$2,status='CONFIRMED' WHERE id=$1",[m.id,m.team2_id]); await advanceWithClient(client,m.id,m.team2_id); }
  }
  await client.query('UPDATE tournaments SET status=\'IN_PROGRESS\' WHERE id=$1',[tournamentId]);
  await client.query('COMMIT');
  const generated=await matches.list(tournamentId); if(io) io.to(`org:${orgId}`).emit('bracket:update',{tournamentId});
  return generated;
 }catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
}
async function advanceWithClient(client,matchId,winnerId){
 const cur=await client.query('SELECT next_match_id FROM matches WHERE id=$1',[matchId]); const next=cur.rows[0]?.next_match_id; if(!next)return;
 const nm=await client.query('SELECT * FROM matches WHERE id=$1',[next]); const row=nm.rows[0]; const slot=row.team1_id?'team2_id':'team1_id'; await client.query(`UPDATE matches SET ${slot}=$2 WHERE id=$1`,[next,winnerId]);
 const updated=(await client.query('SELECT * FROM matches WHERE id=$1',[next])).rows[0];
 if(updated.team1_id && !updated.team2_id){await client.query("UPDATE matches SET winner_id=$2,status='CONFIRMED' WHERE id=$1",[next,updated.team1_id]);await advanceWithClient(client,next,updated.team1_id)}
 if(!updated.team1_id && updated.team2_id){await client.query("UPDATE matches SET winner_id=$2,status='CONFIRMED' WHERE id=$1",[next,updated.team2_id]);await advanceWithClient(client,next,updated.team2_id)}
}
export async function advanceWinner(matchId,winnerId,io,orgId){
 const cur=await query('SELECT next_match_id,tournament_id FROM matches WHERE id=$1',[matchId]); const next=cur.rows[0]?.next_match_id;
 if(!next){await query("UPDATE tournaments SET status='COMPLETED' WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM matches WHERE tournament_id=$1 AND round=(SELECT MAX(round) FROM matches WHERE tournament_id=$1) AND status NOT IN ('CONFIRMED','RESOLVED'))",[cur.rows[0]?.tournament_id]);}
 if(next){const nm=await query('SELECT team1_id,team2_id,status FROM matches WHERE id=$1',[next]); const slot=nm.rows[0].team1_id?'team2_id':'team1_id'; await query(`UPDATE matches SET ${slot}=$2 WHERE id=$1`,[next,winnerId]); const updated=(await query('SELECT team1_id,team2_id FROM matches WHERE id=$1',[next])).rows[0]; if((updated.team1_id&&!updated.team2_id)||(!updated.team1_id&&updated.team2_id)){const autoWinner=updated.team1_id||updated.team2_id;await query("UPDATE matches SET winner_id=$2,status='CONFIRMED' WHERE id=$1",[next,autoWinner]);await advanceWinner(next,autoWinner,io,orgId);}}
 if(io) io.to(`org:${orgId}`).emit('bracket:update',{tournamentId:cur.rows[0]?.tournament_id});
}
