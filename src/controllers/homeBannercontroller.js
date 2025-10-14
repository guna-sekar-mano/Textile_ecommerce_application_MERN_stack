import mongoose from "mongoose";
import { HomeBanner } from "../models/homebannermodel.js";
import { Saveimage } from "../services/imageservice.js";

export const getallBanner = async (req, res, next) => {
    try {
        const { first, rows, globalFilter, ...othersdata } = req.query;
        const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
        const fieldArray = Object.keys(HomeBanner.schema.obj);
        const globalFilters = globalFilter ? {
          $or: fieldArray
            .filter(field => HomeBanner.schema.path(field) instanceof mongoose.Schema.Types.String)
            .map(field => ({ [field]: { $regex: globalFilter, $options: 'i' } }))
        } : {};
        const filter = { $and: [globalFilters, ...individualFilters] };
        
        const resdata = await HomeBanner.find(filter).populate('ProductId', 'Product_Name').skip(Number(first)).limit(Number(rows));
            
        const totallength = await HomeBanner.countDocuments(filter);
        res.send({ resdata, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const saveBanner = async (req, res, next) => {
    try {
        if (req.files && req.files.DesktopImage && req.files.DesktopImage.length > 0) {
            const desktopFile = req.files.DesktopImage[0];
            if (desktopFile.buffer && desktopFile.buffer.length > 0) {
                const desktopImageUrl = await Saveimage(desktopFile, 'banner/desktop');
                req.body.DesktopImage = desktopImageUrl;
            }
        }
        
        if (req.files && req.files.MobileImage && req.files.MobileImage.length > 0) {
            const mobileFile = req.files.MobileImage[0];
            if (mobileFile.buffer && mobileFile.buffer.length > 0) {
                const mobileImageUrl = await Saveimage(mobileFile, 'banner/mobile');
                req.body.MobileImage = mobileImageUrl;
            }
        }
        
        if (req.body['ProductId[]']) {
            req.body.ProductId = Array.isArray(req.body['ProductId[]']) ? req.body['ProductId[]'] : [req.body['ProductId[]']];
            delete req.body['ProductId[]'];
        }
        
        if (req.body.ProductId && Array.isArray(req.body.ProductId)) {
            req.body.ProductId = req.body.ProductId.filter(id => 
                mongoose.Types.ObjectId.isValid(id)
            );
        }
        
        const resdata = await new HomeBanner(req.body).save();
        const populatedData = await HomeBanner.findById(resdata._id).populate('ProductId', 'Product_Name');
        res.send(populatedData);
    } catch (err) {
        console.error('Error in savecategories:', err);
        res.status(500).send({ error: err.message });
    }
}

export const updateBanner = async (req, res, next) => {
    try {
        const { _id } = req.query;
        
        if (req.files && req.files['DesktopImage'] && req.files['DesktopImage'][0]) {
            const desktopFile = req.files['DesktopImage'][0];
            if (desktopFile.buffer && desktopFile.buffer.length > 0) {
                const desktopImageUrl = await Saveimage(desktopFile, 'banner/desktop');
                req.body.DesktopImage = desktopImageUrl;
            }
        }
        
        if (req.files && req.files['MobileImage'] && req.files['MobileImage'][0]) {
            const mobileFile = req.files['MobileImage'][0];
            if (mobileFile.buffer && mobileFile.buffer.length > 0) {
                const mobileImageUrl = await Saveimage(mobileFile, 'banner/mobile');
                req.body.MobileImage = mobileImageUrl;
            }
        }
        
        
        if (req.body['ProductId[]']) {
            req.body.ProductId = Array.isArray(req.body['ProductId[]']) 
                ? req.body['ProductId[]'] 
                : [req.body['ProductId[]']];
            delete req.body['ProductId[]'];
        }
        
        if (req.body.ProductId && Array.isArray(req.body.ProductId)) {
            req.body.ProductId = req.body.ProductId.filter(id => 
                mongoose.Types.ObjectId.isValid(id)
            );
        }
        
        const resdata = await HomeBanner.findOneAndUpdate({ _id }, req.body, { new: true }).populate('ProductId', 'Product_Name');
        
        res.send(resdata);
    } catch (err) {
        console.error('Error in updateBanner:', err);
        res.status(500).send({ error: err.message });
    }
}

export const deleteBanner = async (req, res, next) => {
    try {
        const { _id } = req.query
        const resdata = await HomeBanner.deleteOne({ _id })
        res.send(resdata)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err.message });
    }
}

export const getallCustomerBanner = async (req, res, next) => {
    try {
        const resdata = await HomeBanner.find().populate('ProductId', 'Product_Name');
        const totallength = await HomeBanner.countDocuments();
        
        res.send({ resdata, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
