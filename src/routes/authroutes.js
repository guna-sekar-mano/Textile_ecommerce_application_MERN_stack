import express from 'express';
import { adminlogin } from '../controllers/authentication/logincontroller.js';
import { signup, verifyOTP } from '../controllers/authentication/signupcontroller.js';


const apiRouter = express.Router();
apiRouter.post('/apilogin', adminlogin);
apiRouter.post('/apisignup',signup);
apiRouter.put('/apisendotp',verifyOTP);
// apiRouter.post('/apisentotpforgotPassword', sentotpforgotPassword)
// apiRouter.post('/apiverifyforgotPasswordotp', verifyforgotPasswordotp)
// apiRouter.put('/apiupdateforgotPassword', updateforgotPassword)

export default apiRouter;
