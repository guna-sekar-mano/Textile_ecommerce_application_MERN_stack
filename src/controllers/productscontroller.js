import mongoose from "mongoose";
import { HomeBanner } from "../models/homebannermodel.js";
import Products from "../models/productmodel.js";
import { Saveimage } from "../services/imageservice.js";
import fs from "fs";
import path from "path";

// admin

export const getallproducts = async (req, res, next) => {
    try {
        const { first, rows, globalFilter, colfilter, Sort } = req.query;
        console.log(req.query )//first, rows, globalFilter, colfilter, Sort)
        const fieldArray = Object.keys(Products.schema.obj);
        const globalFilters = globalFilter ? { $or: fieldArray.filter((field1) => Products.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]: { $regex: globalFilter, $options: 'i' } })) } : {};
        const query = colfilter?{...globalFilters,...colfilter}:globalFilters;
        console.log(query)
        const totalRecords = await Products.countDocuments(query);
        var products;
        if(Sort&&Sort.sortField){
            products = await Products.find(query).sort({[`${Sort.sortField}`]:parseInt(Sort.sortOrder, 10),createdAt:-1}).skip(first).limit(rows);
        }else{
            products = await Products.find(query).sort({ createdAt: -1 }).skip(first).limit(rows);
        }
        res.send({resdata: {products: products,totallength: totalRecords}});
    } catch (err) {
        console.error('Get Products Error:', err);
        res.status(500).send({ error: "An error occurred while fetching products" });
    }
};

const normalizeSizes = (sizes) => {
    if (!sizes) return [];
    
    if (typeof sizes === 'string') {
        try {
            const parsed = JSON.parse(sizes);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return sizes.split(',').map(size => size.trim()).filter(size => size);
        }
    }
    
    if (Array.isArray(sizes)) {
        return sizes.map(size => {
            if (typeof size === 'string') {
                if (size.includes(',')) {
                    return size.split(',').map(s => s.trim()).filter(s => s);
                }
                return size;
            }
            return size;
        }).flat();
    }
    
    return [];
};

export const getfilteroptions= async (req, res, next) => {
    try {
        const { field } = req.body;
        console.log(req.body)
        const updatedData = await Products.distinct(field);
        res.send({[field]:updatedData});
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const saveproduct = async (req, res) => {
    try {
        const { variants, ...productData } = req.body;
  
        let processedVariants = [];
        if (variants && typeof variants === 'string') {
            try {
                processedVariants = JSON.parse(variants);
            } catch (e) {
                console.error('Error parsing variants JSON:', e);
                processedVariants = [];
            }
        } else if (Array.isArray(variants)) {
            processedVariants = variants;
        }
        
        for (let i = 0; i < processedVariants.length; i++) {
            const variant = processedVariants[i];

             if (variant.sizes) {
                variant.sizes = normalizeSizes(variant.sizes);
            }
            
            if (variant.sizes) {
                if (typeof variant.sizes === 'string') {
                    variant.sizes = variant.sizes.split(',').map(size => size.trim()).filter(size => size);
                } else if (Array.isArray(variant.sizes)) {
                    variant.sizes = variant.sizes.flatMap(size => 
                        typeof size === 'string' && size.includes(',') 
                            ? size.split(',').map(s => s.trim()).filter(s => s) 
                            : size
                    ).filter(size => size);
                }
            }
            
            const variantImageUrls = [];
            
            if (req.files && req.files.length > 0) {
                const variantFiles = req.files.filter(file => {
                    const fieldname = file.fieldname;
                    return fieldname === `variants[${i}][variant_images]` || fieldname.startsWith(`variants[${i}][variant_images]`);
                });
                
                for (const file of variantFiles) {
                    try {
                        const imageUrl = await Saveimage(file, `product_image/${req.body.Product_Name}/variants/${variant.variant_name || `variant_${i}`}`);
                        variantImageUrls.push(imageUrl);
                    } catch (imageError) {
                        console.error(`Error saving variant ${i} image:`, imageError);
                    }
                }
            }
            
            const existingImages = variant.variant_images ? variant.variant_images.filter(img => typeof img === 'string') : [];
            processedVariants[i].variant_images = [...existingImages, ...variantImageUrls];
        }
        
        const finalProductData = { ...productData, variants: processedVariants,Router_Link: productData.Product_Name.replace(/\s+/g, '-').toLowerCase()};   
        const resdata = await new Products(finalProductData).save();
        res.send({message: resdata ? "Successfully saved" : "Error saving product data",productId: resdata?._id});
        
    } catch (err) {
        console.error('Save Product Error:', err);
        res.status(500).send({ error: "An error occurred while saving product data",details: err.message });
    }
};

export const updateproducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { variants, ...productData } = req.body;

        const product = await Products.findById(id);


        let processedVariants = [];
        if (variants && typeof variants === 'string') {
            try {
                processedVariants = JSON.parse(variants);
            } catch (e) {
                console.error('Error parsing variants JSON:', e);
                processedVariants = [];
            }
        } else if (Array.isArray(variants)) {
            processedVariants = variants;
        }

        for (let i = 0; i < processedVariants.length; i++) {
            const variant = processedVariants[i];
            if (variant.sizes) {
                variant.sizes = normalizeSizes(variant.sizes);
            }
        }

        for (let i = 0; i < processedVariants.length; i++) {
            const variant = processedVariants[i];
            
            if (variant.sizes) {
                if (typeof variant.sizes === 'string') {
                    try {
                        variant.sizes = JSON.parse(variant.sizes);
                    } catch (e) {
                        variant.sizes = variant.sizes.split(',').map(size => size.trim()).filter(size => size);
                    }
                } else if (Array.isArray(variant.sizes)) {
                    variant.sizes = variant.sizes.flatMap(size => 
                        typeof size === 'string' && size.includes(',') 
                            ? size.split(',').map(s => s.trim()).filter(s => s) 
                            : size
                    ).filter(size => size);
                }
            }
        }

           if (product.variants && product.variants.length > 0) {
            product.variants.forEach(oldVariant => {
                if (oldVariant.variant_images && oldVariant.variant_images.length > 0) {
                    oldVariant.variant_images.forEach(imgPath => {
                        const stillUsed = processedVariants.some(newVariant => 
                            newVariant.variant_images && newVariant.variant_images.includes(imgPath)
                        );
                        
                        if (!stillUsed) {
                            const fullPath = path.join(process.cwd(), "uploads", imgPath.replace("uploads/", ""));
                            fs.unlink(fullPath, (err) => {
                                if (err) console.error("Error deleting old variant image:", fullPath, err);
                            });
                        }
                    });
                }
            });
        }

        for (let i = 0; i < processedVariants.length; i++) {
            const variant = processedVariants[i];
            const variantImageUrls = [];
            
            if (req.files && req.files.length > 0) {
                const variantFiles = req.files.filter(file => 
                    file.fieldname === `variants[${i}][variant_images]`
                );
                
                for (const file of variantFiles) {
                    try {
                        const imageUrl = await Saveimage(file, `product_image/${productData.Product_Name}/variants/${variant.variant_name || `variant_${i}`}`);
                        variantImageUrls.push(imageUrl);
                    } catch (imageError) {
                        console.error(`Error saving variant ${i} image:`, imageError);
                    }
                }
            }
            
            const existingVariantImages = variant.variant_images || [];
            processedVariants[i].variant_images = [...existingVariantImages, ...variantImageUrls];
        }

        const updateData = {
            ...productData,
            variants: processedVariants,
            Router_Link: productData.Product_Name.replace(/\s+/g, '-').toLowerCase()
            // Images: [...existingMainImagesToKeep, ...mainImageUrls]
        };

        const resdata = await Products.findOneAndUpdate({ _id: id }, updateData, { new: true });
        
        res.send({ 
            message: resdata ? "Successfully updated" : "Error updating product data",
            productId: resdata?._id,
            // mainImagesCount: updateData.Images.length,
            variantsCount: updateData.variants.length
        });
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).send({ error: "An error occurred while updating product data", details: err.message });
    }
};

export const deleteProducts = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Products.findById(id);
        if (!product) return res.status(404).send({ message: "Product not found" });

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                if (variant.images && variant.images.length > 0) {
                    variant.images.forEach(imgPath => {
                        const fullPath = path.join(process.cwd(), "uploads", imgPath.replace("uploads/", ""));
                        fs.unlink(fullPath, (err) => {
                            if (err) console.error("Error deleting variant image:", fullPath, err);
                        });
                    });
                }
            });
        }

        const resdata = await Products.findByIdAndDelete(id);
        res.send({ message: resdata ? "Successfully deleted" : "Error deleting product" });
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).send({ error: "An error occurred while deleting product" });
    }
};

// customer

export const getallproductsforCustomer = async (req, res) => {
    try {
        const { category_id } = req.query;
        
        let query = {};
        
        if (category_id) {
            query.category_id = category_id;
        }
        
        const products = await Products.find(query).sort({ createdAt: -1 });
        
        res.send({ resdata: products, totallength: products.length });
        
    } catch (err) {
        console.error("Get Products Error:", err);
        res.status(500).send({ error: "An error occurred while fetching products",details: err.message });
    }
};

export const getCustomerProductById = async (req, res) => {
  try {
    const { routerLink, productType } = req.params;

    const query = { Router_Link: routerLink, status: "Active" };
    const resdata = await Products.findOne(query);

    if (!resdata) {
      return res.status(404).send("Product not found");
    }

    const toUrlFriendly = (str) => {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    if (productType && toUrlFriendly(resdata.Product_type) !== productType) {
      console.warn(
        `URL mismatch: Expected ${toUrlFriendly(resdata.Product_type)}, Got ${productType}`
      );
    }

    res.send({ resdata });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Product");
  }
};

// export const getPopularProductsforCustomer = async (req, res) => {
//     try {
//         const products = await Products.find({ is_popular_products: true }).sort({ createdAt: -1 });

//         res.send({ resdata: products, totallength: products.length });
//     } catch (err) {
//         console.error("Get Popular Products Error:", err);
//         res.status(500).send({ error: "An error occurred while fetching popular products" });
//     }
// };


export const getNewArrivalproducts = async (req, res, next) => {
    try {
        const { query } = req.query;
        console.log(req.query);
        const currentDate = new Date();
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(currentDate.getDate() - 15);
        
        const dateFilter = {createdAt: {$gte: fifteenDaysAgo,$lte: currentDate}};
        
        const products = await Products.find(dateFilter).sort({ createdAt: -1 });
        
        const totalRecords = products.length;
        
        res.send({resdata: products,totallength: totalRecords});
    } catch (err) {
        console.error('Get Products Error:', err);
        res.status(500).send({ error: "An error occurred while fetching products" });
    }
};

export const getSalePriceproducts = async (req, res) => {
    try {
        const { category_id } = req.query;
        
        let query = {};
        
        if (category_id) {
            query.category_id = category_id;
        }
        
        const products = await Products.find(query).sort({ createdAt: -1 });
        
        const productsWithSale = products.filter(product => {
            return product.variants && product.variants.some(variant => {
                if (variant.sizes && variant.sizes.length > 0) {
                    return variant.sizes.some(size => 
                        size.sale_price && parseFloat(size.sale_price) > 0
                    );
                }
                return variant.sale_price && parseFloat(variant.sale_price) > 0;
            });
        });
        
        res.send({ resdata: productsWithSale, totallength: productsWithSale.length });
        
    } catch (err) {
        console.error("Get Products Error:", err);
        res.status(500).send({ error: "An error occurred while fetching products", details: err.message });
    }
};
