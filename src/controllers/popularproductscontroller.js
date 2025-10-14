import mongoose from "mongoose";
import { Popularproducts } from "../models/popularproductmodal.js";
import { Saveimage } from "../services/imageservice.js";

export const getallPopularproducts = async (req, res, next) => {
    try {
        const { first, rows, globalfilter, ...othersdata } = req.query;
        const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
        const fieldArray = Object.keys(Popularproducts.schema.obj);
        const globalFilter = globalfilter ? {
          $or: fieldArray
            .filter(field => Popularproducts.schema.path(field) instanceof mongoose.Schema.Types.String)
            .map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } }))
        } : {};
        const filter = { $and: [globalFilter, ...individualFilters] };
        
        const resdata = await Popularproducts.find(filter).populate('ProductId', 'Product_Name').skip(Number(first)).limit(Number(rows));
            
        const totallength = await Popularproducts.countDocuments(filter);
        res.send({ resdata, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const savePopularproducts = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            
            for (const file of req.files) {
                if (file.buffer && file.buffer.length > 0) {
                    const imageUrl = await Saveimage(file, 'popularproducts');
                    imageUrls.push(imageUrl);
                }
            }
            
            if (imageUrls.length > 0) {
                req.body.Images = imageUrls;
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
        
        const resdata = await new Popularproducts(req.body).save();
        
        const populatedData = await Popularproducts.findById(resdata._id).populate('ProductId', 'Product_Name');
            
        res.send(populatedData);
    } catch (err) {
        console.error('Error in save Popularproducts:', err);
        res.status(500).send({ error: err.message });
    }
}

export const updatePopularproducts = async (req, res, next) => {
    try {
        const { _id } = req.query;
        
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            
            for (const file of req.files) {
                if (file.buffer && file.buffer.length > 0) {
                    const imageUrl = await Saveimage(file, 'popularproducts');
                    imageUrls.push(imageUrl);
                }
            }
            
            if (imageUrls.length > 0) {
                req.body.Images = imageUrls;
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
        
        const resdata = await Popularproducts.findOneAndUpdate({ _id }, req.body, { new: true }).populate('ProductId', 'Product_Name');
        
        res.send(resdata);
    } catch (err) {
        console.error('Error in update Popularproducts:', err);
        res.status(500).send({ error: err.message });
    }
}

export const deletePopularproducts = async (req, res, next) => {
    try {
        const { _id } = req.query
        const resdata = await Popularproducts.deleteOne({ _id })
        res.send(resdata)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err.message });
    }
}


export const getallCustomerPopularProducts = async (req, res, next) => {
    try {
        const resdata = await Popularproducts.find({ Status: 'Active' }).populate({ path: 'ProductId', model: 'products', match: { status: 'Active' } }).sort({ createdAt: -1 });

        const filteredData = resdata.filter(item => item.ProductId && item.ProductId.length > 0);

        const totallength = filteredData.length;
        
        res.send({ resdata: filteredData, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};