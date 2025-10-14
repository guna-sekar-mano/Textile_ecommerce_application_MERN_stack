import express from 'express'
import apiRouter from './authroutes.js';
import ProductRouter from './productroutes.js';
import CustomerRouter from './customerroutes.js';
import HookupsRouter from './hookupsroutes.js';
import cartRouter from './cartroutes.js';
import wishlistRouter from './wishlistroutes.js';
import categoryRouter from './categoryroutes.js';
import homebannerRouter from './homeBannerroutes.js';
import OrderRouter from './orderroutes.js';
import PopularproductsRouter from './popularproductsroutes.js';
import SearchRouter from './searchroutes.js';
import DashboardRouter from './dashboardroutes.js';
import couponsRouter from './couponsroutes.js';
import NewsLetterRouter from './newletterroutes.js';

const router = express.Router()

router.use('/api',apiRouter)
router.use('/products',ProductRouter)
router.use('/customers',CustomerRouter)
router.use('/hookups',HookupsRouter)
router.use('/cart',cartRouter)
router.use('/wishlists', wishlistRouter)
router.use('/categories', categoryRouter)
router.use('/homeBanner', homebannerRouter)
router.use('/order', OrderRouter)
router.use('/popular-products', PopularproductsRouter)
router.use('/search', SearchRouter)
router.use('/dashboard', DashboardRouter)
router.use('/coupons', couponsRouter)
router.use('/newsletter', NewsLetterRouter)


export default router;