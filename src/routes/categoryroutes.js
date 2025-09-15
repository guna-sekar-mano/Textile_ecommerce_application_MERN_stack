import express from 'express'
import multer from 'multer'
import authMiddleware from '../middlewares/authmiddlewares.js'
import { deleteCategory, getallcategory, getallCustomercategory, savecategory, updatecategory } from '../controllers/categorycontroller.js'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const categoryRouter = express.Router()

categoryRouter.get('/apigetallcategory',authMiddleware(['Admin']), getallcategory)
categoryRouter.get('/apigetCustomercategory', getallCustomercategory)
// categoryRouter.get('/products/category/:categoryId', getProductsByCategory)

categoryRouter.post('/apisavecategory', authMiddleware(['Admin']), upload.array('Images'), savecategory)
categoryRouter.put('/apiupdatecategory', authMiddleware(['Admin']), upload.array('Images'), updatecategory)
categoryRouter.delete('/apideletecategory', authMiddleware(['Admin']), deleteCategory)

export default categoryRouter