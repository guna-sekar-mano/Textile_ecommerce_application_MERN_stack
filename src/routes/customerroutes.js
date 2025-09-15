import express from 'express';
import authMiddleware from '../middlewares/authmiddlewares.js';
import { deleteShippingAddress, getallCustomers, getshippingdetails, saveShippingAddress, updateshippingAddress } from '../controllers/Customercontroller.js';

const CustomerRouter = express.Router();

CustomerRouter.get('/apigetallcustomers',authMiddleware(['Admin','Customer']),getallCustomers);
// CustomerRouter.post('/getfilteroptions', authMiddleware(['Admin']),getfilteroptions);
CustomerRouter.get('/apigetshippingdetails',authMiddleware(['Customer']),getshippingdetails);
CustomerRouter.post('/apisaveshippingAddress',authMiddleware(['Customer']),saveShippingAddress);
CustomerRouter.put('/updateShippingaddress',authMiddleware(['Customer']),updateshippingAddress);
CustomerRouter.delete('/apideleteShipping',authMiddleware(['Customer']),deleteShippingAddress);

export default CustomerRouter;