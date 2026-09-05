import {Router} from 'express';import {authenticate} from '../middleware/auth.js';import {addPlayer,removePlayer,playerList} from '../controllers/tournamentController.js';
const r=Router();r.get('/:id/players',authenticate,playerList);r.post('/:id/players',authenticate,addPlayer);r.delete('/:id/players/:userId',authenticate,removePlayer);export default r;
