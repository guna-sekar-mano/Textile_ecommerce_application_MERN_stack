import express from 'express'
import multer from 'multer'
import authMiddleware from '../middlewares/authmiddlewares.js'
import { deletePopularproducts, getallCustomerPopularProducts, getallPopularproducts, savePopularproducts, updatePopularproducts } from '../controllers/popularproductscontroller.js'


const storage = multer.memoryStorage()
const upload = multer({ storage })
const PopularproductsRouter = express.Router()

PopularproductsRouter.get('/apigetallpopularproducts', getallPopularproducts)
PopularproductsRouter.post('/apisavepopularproducts', authMiddleware(['Admin']), upload.array('Images'), savePopularproducts)
PopularproductsRouter.put('/apiupdatepopularproducts', authMiddleware(['Admin']), upload.array('Images'), updatePopularproducts)
PopularproductsRouter.delete('/apideletepopularproducts', authMiddleware(['Admin']), deletePopularproducts)

PopularproductsRouter.get('/apigetCustomerpopularproducts', getallCustomerPopularProducts)


export default PopularproductsRouter