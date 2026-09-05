import {query} from '../config/db.js';
export const notifications={
 create:async(userId,message)=>(await query('INSERT INTO notifications(user_id,message) VALUES($1,$2) RETURNING *',[userId,message])).rows[0],
 list:async userId=>(await query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',[userId])).rows,
 read:async(id,userId)=>(await query('UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2 RETURNING *',[id,userId])).rows[0],
 readAll:async userId=>query('UPDATE notifications SET is_read=true WHERE user_id=$1',[userId])
};
