import express from 'express';
import { deleteHookups, getallHookups, getallHookupsForProduct, saveHookups, updateHookups } from '../controllers/hookupscontroller.js';
import authMiddleware from '../middlewares/authmiddlewares.js';

const HookupsRouter = express.Router();

HookupsRouter.post('/apisaveHookups',authMiddleware(['Admin']),saveHookups);
HookupsRouter.get('/apigetallHookups',authMiddleware(['Admin']),getallHookups);
HookupsRouter.delete('/apideleteHookups/:id',authMiddleware(['Admin']),deleteHookups);
HookupsRouter.put('/apiupdateHookups/:id',authMiddleware(['Admin']),updateHookups);
HookupsRouter.get('/apigetHookupforProducts',authMiddleware(['Admin']),getallHookupsForProduct);

export default HookupsRouter;