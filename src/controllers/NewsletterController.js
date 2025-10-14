import mongoose from "mongoose";
import { Newsletter } from "../models/newsLettermodel.js";

export const saveNewsletter = async (req, res) => {
    try {
        const existingEmail = await Newsletter.findOne({
            Newsletter_email: req.body.Newsletter_email
        });

        if (existingEmail) {
            return res.send({
                message: "This email is already subscribed to our newsletter"
            });
        }
        const resdata = await new Newsletter(req.body).save();
        res.send({ message: "Newsletter successfully saved", data: resdata });
    } catch (err) {
        console.error("Error saving Newsletter:", err);
        res.send({ message: "Error saving Newsletter", error: err });
    }
};

  export const getNewsletter = async (req, res, next) => {
    try {
      const { first, rows, globalFilter, colfilter, Sort } = req.query;
      const fieldArray = Object.keys(Newsletter.schema.obj);
      const globalFilters = globalFilter ? { $or: fieldArray.filter((field1) => Newsletter.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]: { $regex: globalFilter, $options: 'i' } })) } : {};
      const filter = colfilter?{ ...globalFilters,...colfilter} : globalFilters;
      const resdata = await Newsletter.find(filter).skip(first).limit(rows);
      const totallength = await Newsletter.countDocuments(filter);
      res.send({ resdata, totallength });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
