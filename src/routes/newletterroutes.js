import express from 'express';
import { getNewsletter, saveNewsletter } from '../controllers/NewsletterController.js';

const NewsLetterRouter = express.Router();

NewsLetterRouter.post('/apisaveNewsletter',saveNewsletter);
NewsLetterRouter.get('/apigetNewsletter',getNewsletter);

export default NewsLetterRouter;