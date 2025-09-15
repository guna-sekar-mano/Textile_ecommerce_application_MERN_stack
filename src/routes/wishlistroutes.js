import express from 'express'
import authMiddleware from '../middlewares/authmiddlewares.js'
import { deleteAllitems, deleteOneitems, getAllitems, saveitems, updateitems } from '../controllers/wishlistcontroller.js'


const wishlistRouter = express.Router()
wishlistRouter.post('/apisavewislist', authMiddleware(['Admin','Customer']), saveitems)
wishlistRouter.get('/apigetallwislist',authMiddleware(['Admin','Customer']), getAllitems)
wishlistRouter.put('/apiupdatewislist',authMiddleware(['Admin','Customer']), updateitems)
wishlistRouter.delete('/apideletewislist',authMiddleware(['Admin','Customer']), deleteAllitems)
wishlistRouter.delete('/apideleteOnewislist',authMiddleware(['Admin','Customer']), deleteOneitems)

export default wishlistRouter
