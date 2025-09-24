import express from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/authmiddlewares.js';
import { deleteProducts, getallheaderProducts, getallproducts, getallproductsforCustomer, getBannerProducts, getCustomerProductById, getfilteroptions, saveproduct, updateproducts } from '../controllers/productscontroller.js';

const ProductRouter = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedFields = [
            'Images',
            ...Array.from({ length: 10 }, (_, i) => `variants[${i}][variant_images]`),
            ...Array.from({ length: 10 }, (_, i) => `variants[${i}][images]`)
        ];
        
        if (allowedFields.includes(file.fieldname) || file.fieldname.includes('variant_images') || file.fieldname.includes('[images]')) {
            cb(null, true);
        } else {
            console.log('Rejected field:', file.fieldname);
            cb(null, false);
        }
    }
});

ProductRouter.post('/apisaveproductdata', authMiddleware(['Admin']), upload.any(), saveproduct);
ProductRouter.get('/apigetproductdata', authMiddleware(['Admin']), getallproducts);
ProductRouter.put('/apiupdateproductdata/:id', authMiddleware(['Admin']), upload.any(), updateproducts);
ProductRouter.delete('/apideleteproductsdata/:id', authMiddleware(['Admin']), deleteProducts);


ProductRouter.get('/apigetproductdataforCustomer', getallproductsforCustomer);
ProductRouter.get('/apigetproductsbyID/:id/:productType/:productName', getCustomerProductById);
ProductRouter.get('/apigetHeaderProducts', getallheaderProducts);
ProductRouter.post('/getfilteroptions', getfilteroptions);

ProductRouter.get('/apigetBannerProducts', getBannerProducts);

export default ProductRouter;