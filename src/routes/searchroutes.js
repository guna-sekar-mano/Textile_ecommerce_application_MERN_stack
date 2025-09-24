import express from 'express';
import { searchProducts } from '../controllers/searchcontroller.js';

const SearchRouter = express.Router();

SearchRouter.get('/searchproducts',searchProducts);



export default SearchRouter;