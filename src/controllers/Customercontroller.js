import mongoose from "mongoose";
import { Customer, Shiping } from "../models/signupmodel.js";

  export const getallCustomers = async (req, res, next) => {
    try {
      const { first, rows, globalFilter, colfilter, Sort } = req.query;
      const fieldArray = Object.keys(Customer.schema.obj);
      const globalFilters = globalFilter ? { $or: fieldArray.filter((field1) => Customer.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]: { $regex: globalFilter, $options: 'i' } })) } : {};
      const filter = colfilter?{ ...globalFilters,...colfilter} : globalFilters;
      const resdata = await Customer.find(filter).skip(first).limit(rows);
      const totallength = await Customer.countDocuments(filter);
      res.send({ resdata, totallength });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  export const getshippingdetails = async (req, res) => {
    try {
        const resdata = await Shiping.find({ Email:req.user.Email });
        res.send({ resdata });
    } catch (err) {
        console.error("Error fetching shipping details:", err);
        res.send({ message: "Error fetching shipping details" });
    }
};

export const saveShippingAddress = async (req, res) => {
    try {
      const resdata = await new Shiping({ 
        ...req.body, 
        Email: req.user.Email 
      }).save();
      
      res.send({ message: "Address successfully saved", data: resdata });
    } catch (err) {
      console.error("Error saving shipping address:", err);
      res.send({ message: "Error saving shipping address", error: err });
    }
  };

  export const updateshippingAddress = async (req, res) => {
    try {
      const { _id } = req.query
      const resdata = await Shiping.findOneAndUpdate({ _id }, req.body, { new: true })
      res.send({message:'Address updated successfully' ,resdata})
    } catch (err) {
      console.log(err)
    }
  }
  
  export const deleteShippingAddress = async (req, res) => {
    try {
      const { _id } = req.query
      console.log(_id);
      const resdata = await Shiping.deleteOne({ _id })
      res.send({message:'Address deleted successfully',resdata})
    } catch (err) {
      console.error(err)
    }
  }

export const getaccountdetails = async (req, res) => {
    try {
        const resdata = await Customer.find({ Email:req.user.Email });
        res.send({ resdata });
    } catch (err) {
        console.error("Error fetching shipping details:", err);
        res.send({ message: "Error fetching Account details" });
    }
};

export const updateaccountdetails = async (req, res) => {
  try {
    const { _id } = req.query
    // console.log(req.query);
    const resdata = await Customer.findOneAndUpdate({ _id }, req.body, { new: true })
    res.send({message:'Account updated successfully' ,resdata})
  } catch (err) {
    console.log(err)
  }
}

export const getfilteroptions= async (req, res, next) => {
  try {
    const { field } = req.body;
    // console.log(req.body)
    const updatedData = await Customer.distinct(field);
    res.send({[field]:updatedData});
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCouponCustomers = async (req, res, next) => {
  try {
    const resdata = await Customer.find({}, 'Email');
    res.send({ resdata });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};