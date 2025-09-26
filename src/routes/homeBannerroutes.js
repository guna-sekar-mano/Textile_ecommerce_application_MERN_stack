import express from 'express'
import multer from 'multer'
import authMiddleware from '../middlewares/authmiddlewares.js'
import { deleteBanner, getallBanner, getallCustomerBanner, saveBanner, updateBanner } from '../controllers/homeBannercontroller.js'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const homebannerRouter = express.Router()

homebannerRouter.get('/apigetallbanner',authMiddleware(['Admin']), getallBanner)
homebannerRouter.get('/apigetCustomerbanner', getallCustomerBanner)

homebannerRouter.post('/apisavebanner', authMiddleware(['Admin']), upload.fields([{ name: 'DesktopImage', maxCount: 1 },{ name: 'MobileImage', maxCount: 1 }]), saveBanner)
homebannerRouter.put('/apiupdatebanner', authMiddleware(['Admin']), upload.fields([{ name: 'DesktopImage', maxCount: 1 },{ name: 'MobileImage', maxCount: 1 }]), updateBanner)
homebannerRouter.delete('/apideletebanner', authMiddleware(['Admin']), deleteBanner)


export default homebannerRouter