import express from 'express';
import { deleteAllcart, deletecartone, getAllCart, savecart, updateCart } from '../controllers/cartcontroller.js';
import authMiddleware from '../middlewares/authmiddlewares.js';


const cartRouter = express.Router()


cartRouter.post('/savecart' , authMiddleware(['Admin','Customer']),savecart);
cartRouter.get('/getallcart' , authMiddleware(['Admin','Customer']),getAllCart)
cartRouter.put('/updatecart' , authMiddleware(['Admin','Customer']),updateCart)
cartRouter.delete('/deleteonecart', authMiddleware(['Admin', 'Customer']), deletecartone);
cartRouter.delete('/deleteallcart', authMiddleware(['Admin', 'Customer']), deleteAllcart);

export default cartRouter