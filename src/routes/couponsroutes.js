import express from 'express'
import { deleteCoupon, getallCoupons, getAllCustomerCoupons, saveCoupons, trackCouponUsage, updateCoupondata, validateCouponUsage } from '../controllers/CouponController.js';
import authMiddleware from '../middlewares/authmiddlewares.js';

const couponsRouter = express.Router()

couponsRouter.post('/apisaveCoupons', authMiddleware(['Admin']), saveCoupons);
couponsRouter.get('/apigetallCoupons', authMiddleware(['Admin']), getallCoupons);
couponsRouter.put('/apiupdateCoupons/:id', authMiddleware(['Admin']), updateCoupondata);
couponsRouter.delete('/apideleteCoupon/:id', authMiddleware(['Admin']), deleteCoupon);
couponsRouter.get('/apigetallcustomercoupon', getAllCustomerCoupons);

couponsRouter.post('/apitrackCouponUsage', trackCouponUsage);
couponsRouter.post('/apivalidateCouponUsage', validateCouponUsage);

export default couponsRouter;