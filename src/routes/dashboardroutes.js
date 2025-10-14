import express from 'express';
import authMiddleware from "../middlewares/authmiddlewares.js";
import { dashboardCardCounts } from '../controllers/dashboardController.js';

const DashboardRouter = express.Router();

DashboardRouter.get('/apigetDashboardCount', authMiddleware(['Admin']), dashboardCardCounts);

export default DashboardRouter;