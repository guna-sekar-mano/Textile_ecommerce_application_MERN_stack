import { Customer, Shiping } from "../../models/signupmodel.js";
import bcrypt from "bcrypt";
import sendMail from "../../services/mailservice.js";

export const signup = async (req, res) => {
  try {
    const { First_Name, Last_Name, Email, Mobilenumber, Password, Role, Address, Street_Address, Country, State, City, Zipcode,  ...othersdata } = req.body;

    const findUser = await Customer.findOne({ Email });
    if (findUser) {
      return res.status(400).json({ success: false, message: 'Email already exists in customer records' });
    }

    const { otp } = await sendMail({ Email });
    const hashPassword = await bcrypt.hash(Password, 10);

    const newCustomer = new Customer({ First_Name, Last_Name, Email, Mobilenumber, Password: hashPassword, Role, OTP: otp, ...othersdata });
    await newCustomer.save();

    const newShipping = new Shiping({ First_Name, Last_Name, Email, Mobilenumber, Address, Street_Address, Country, State, City, Zipcode });
    await newShipping.save();

    res.send({ success: true, message: 'Successfully signedup. OTP sent to your email.', });

  } catch (error) {
    console.error('Error signup user:', error);
    res.send({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { Email, OTP } = req.body;
    console.log('Verifying OTP for:', req.body);
    
    const user = await Customer.findOne({ Email });
    if (!user) { 
      return res.status(404).json({ success: false,message: 'User not found'   });
    }

    if (user.OTP === null) { 
      return res.status(400).json({ success: false,message: 'OTP already verified' });
    }
    
    if (user.OTP !== OTP) { 
      return res.status(400).json({ success: false,message: 'Invalid OTP' });
    }

    user.OTP = null;
    user.Status = "Active";
    await user.save();

    res.status(200).json({ success: true,message: 'OTP verified successfully'});
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false,mmessage: 'Internal server error',error: error.message });
  }
};