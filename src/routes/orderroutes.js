import express from 'express';
import { checkFirstTimeUser, downloadPDF, getallOrders, getfilteroptions, getorderdetails, getOrderitemsbyid, saveOrder, updateOrder } from "../controllers/ordercontroller.js";
import authMiddleware from "../middlewares/authmiddlewares.js";

const OrderRouter = express.Router();

OrderRouter.post('/saveorder',authMiddleware(['Admin','Customer']),saveOrder);
OrderRouter.post('/getfilteroptions', authMiddleware(['Admin','Customer']), getfilteroptions);
OrderRouter.get('/apigetallorder', authMiddleware(['Admin','Customer']), getallOrders);
OrderRouter.post('/downloadPDF', authMiddleware(['Customer', 'Admin']), downloadPDF);
OrderRouter.get('/apigetorderitemsbyid', authMiddleware(['Customer', 'Admin']), getOrderitemsbyid);
OrderRouter.put('/apiupdateorder', authMiddleware(['Customer', 'Admin']), updateOrder);
// OrderRouter.post('/createorder',createOrder);
OrderRouter.get('/apigetorderdetails',authMiddleware(['Admin','Customer']),getorderdetails);
OrderRouter.get('/checkCustomerOrderforCoupon', authMiddleware(['Customer', 'Admin']), checkFirstTimeUser);
export default OrderRouter;