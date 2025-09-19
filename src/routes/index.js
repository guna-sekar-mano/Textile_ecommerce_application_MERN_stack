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



export default router;