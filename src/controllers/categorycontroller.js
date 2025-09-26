import mongoose from 'mongoose'
import { Saveimage } from '../services/imageservice.js';
import { Category } from '../models/categorymodel.js';

export const getallcategory = async (req, res, next) => {
    try {
        const { first, rows, globalfilter, ...othersdata } = req.query;
        const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
        const fieldArray = Object.keys(Category.schema.obj);
        const globalFilter = globalfilter ? {
          $or: fieldArray
            .filter(field => Category.schema.path(field) instanceof mongoose.Schema.Types.String)
            .map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } }))
        } : {};
        const filter = { $and: [globalFilter, ...individualFilters] };
        
        const resdata = await Category.find(filter).skip(Number(first)).limit(Number(rows));
            
        const totallength = await Category.countDocuments(filter);
        res.send({ resdata, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const savecategory = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            
            for (const file of req.files) {
                if (file.buffer && file.buffer.length > 0) {
                    const imageUrl = await Saveimage(file, 'categories');
                    imageUrls.push(imageUrl);
                }
            }
            
            if (imageUrls.length > 0) {
                req.body.Images = imageUrls;
            }
        }
        
        const resdata = await new Category(req.body).save();
        
        res.send(resdata);
    } catch (err) {
        console.error('Error in savecategories:', err);
        res.status(500).send({ error: err.message });
    }
}

export const updatecategory = async (req, res, next) => {
    try {
        const { _id } = req.query;
        
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            
            for (const file of req.files) {
                if (file.buffer && file.buffer.length > 0) {
                    const imageUrl = await Saveimage(file, 'categories');
                    imageUrls.push(imageUrl);
                }
            }
            
            if (imageUrls.length > 0) {
                req.body.Images = imageUrls;
            }
        }
        
        const resdata = await Category.findOneAndUpdate({ _id }, req.body, { new: true });
        res.send(resdata);
    } catch (err) {
        console.error('Error in updateCategory:', err);
        res.status(500).send({ error: err.message });
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { _id } = req.query
        const resdata = await Category.deleteOne({ _id })
        res.send(resdata)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err.message });
    }
}

export const getallCustomercategory = async (req, res, next) => {
    try {
        const resdata = await Category.find().sort({ createdAt: -1 });
        const totallength = await Category.countDocuments();
        
        res.send({ resdata, totallength });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// export const getProductsByCategory = async (req, res, next) => {
//     try {
//         const { categoryId } = req.params;
//         const { first, rows, globalfilter, ...othersdata } = req.query;
       
//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(404).send({ error: 'Category not found' });
//         }
       
//         const productIds = category.ProductId || [];
        
//         if (productIds.length === 0) {
//             return res.send({ resdata: [], totallength: 0, categoryName: category.Category_Name });
//         }
       
//         let filter = {
//             _id: { $in: productIds },
//             status: 'Active'
//         };
       
//         if (globalfilter || Object.keys(othersdata).length > 0) {
//             const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
//             const fieldArray = Object.keys(Products.schema.obj);
//             const globalFilter = globalfilter ? {
//               $or: fieldArray
//                 .filter(field => Products.schema.path(field) instanceof mongoose.Schema.Types.String)
//                 .map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } }))
//             } : {};
//             filter = { ...filter, $and: [globalFilter, ...individualFilters] };
//         }
       
//         let query = Products.find(filter).sort({ createdAt: -1 });
       
//         if (first !== undefined && rows !== undefined) {
//             query = query.skip(Number(first)).limit(Number(rows));
//         }
       
//         const resdata = await query;
//         const totallength = await Products.countDocuments(filter);
       
//         res.send({ resdata, totallength, categoryName: category.Category_Name });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// };