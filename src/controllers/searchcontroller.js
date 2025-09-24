import mongoose from "mongoose";
import Products from "../models/productmodel.js";

export const searchProducts = async (req, res) => {
    try {
        const { query, category_id, gender, product_type, min_price, max_price, sort_by = 'relevance', limit = 20, page = 1 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        let pipeline = [];

        let matchStage = {
            status: 'Active',
            variants: { $elemMatch: { status: 'Active',sizes: { $exists: true, $ne: [] }} 
            }
        };

        if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
            matchStage.category_id = new mongoose.Types.ObjectId(category_id);
        }

        if (gender) {
            matchStage.$and = matchStage.$and || [];
            matchStage.$and.push({
                $or: [
                    { gender: { $regex: new RegExp(`^${gender}$`, 'i') } },
                    { 'variants.gender': { $regex: new RegExp(`^${gender}$`, 'i') } }
                ]
            });
        }

        if (product_type) {
            matchStage.$and = matchStage.$and || [];
            matchStage.$and.push({
                $or: [
                    { Product_type: { $regex: new RegExp(product_type, 'i') } },
                    { 'variants.Product_type': { $regex: new RegExp(product_type, 'i') } }
                ]
            });
        }

        if (query && query.trim()) {
            const searchQuery = query.trim();
            const searchTerms = searchQuery.split(/\s+/);
            
            const exactMatch = new RegExp(`^${searchQuery}$`, 'i');
            const startsWithMatch = new RegExp(`^${searchQuery}`, 'i');
            const containsMatch = new RegExp(searchQuery.replace(/\s+/g, '.*'), 'i');
            const wordMatches = searchTerms.map(term => new RegExp(term, 'i'));

            const searchConditions = [
                { Product_type: exactMatch },
                
                { 'variants.Product_type': exactMatch },
                
                { gender: exactMatch },
                
                { 'variants.gender': exactMatch },
                
                { Product_Name: exactMatch },
                
                { Product_type: startsWithMatch },
                
                { Product_Name: startsWithMatch },
                
                { Product_Name: containsMatch },
                
                { Category: { $in: wordMatches } },
                
                { tags: { $in: wordMatches } },
                
                { 'variants.tags': { $in: wordMatches } },
                
                { description: containsMatch },
                
                { 'variants.description': containsMatch },
                
                { 'variants.variant_name': { $in: wordMatches } },
                
                { material_care: containsMatch },
                
                { 'variants.material_care': containsMatch },
                
                ...searchTerms.map(term => {
                    const fuzzyTerm = new RegExp(term.substring(0, Math.max(3, Math.floor(term.length * 0.7))), 'i');
                    return {
                        $or: [
                            { Product_Name: fuzzyTerm },
                            { Product_type: fuzzyTerm },
                            { gender: fuzzyTerm },
                            { tags: fuzzyTerm },
                            { 'variants.Product_type': fuzzyTerm },
                            { 'variants.gender': fuzzyTerm },
                            { 'variants.tags': fuzzyTerm }
                        ]
                    };
                })
            ];

            if (matchStage.$and) {
                matchStage.$and.push({ $or: searchConditions });
            } else {
                matchStage.$or = searchConditions;
            }
        }

        pipeline.push({ $match: matchStage });

        pipeline.push({ $unwind: "$variants" });
        pipeline.push({ $match: { "variants.status": "Active" } });

        if (min_price || max_price) {
            let priceMatch = {};
            
            const minPrice = min_price ? parseFloat(min_price) : null;
            const maxPrice = max_price ? parseFloat(max_price) : null;
            
            if (minPrice && maxPrice) {
                priceMatch.$or = [
                    { 
                        $and: [
                            { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
                            { $expr: { 
                                $and: [
                                    { $gte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, minPrice] },
                                    { $lte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, maxPrice] }
                                ]
                            }}
                        ]
                    },
                    { 
                        $and: [
                            { $or: [
                                { "variants.sale_price": { $exists: false } },
                                { "variants.sale_price": null },
                                { "variants.sale_price": "" }
                            ]},
                            { $expr: { 
                                $and: [
                                    { $gte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, minPrice] },
                                    { $lte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, maxPrice] }
                                ]
                            }}
                        ]
                    }
                ];
            } else if (minPrice) {
                priceMatch.$or = [
                    { 
                        $and: [
                            { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
                            { $expr: { $gte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, minPrice] }}
                        ]
                    },
                    { 
                        $and: [
                            { $or: [
                                { "variants.sale_price": { $exists: false } },
                                { "variants.sale_price": null },
                                { "variants.sale_price": "" }
                            ]},
                            { $expr: { $gte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, minPrice] }}
                        ]
                    }
                ];
            } else if (maxPrice) {
                priceMatch.$or = [
                    { 
                        $and: [
                            { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
                            { $expr: { $lte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, maxPrice] }}
                        ]
                    },
                    { 
                        $and: [
                            { $or: [
                                { "variants.sale_price": { $exists: false } },
                                { "variants.sale_price": null },
                                { "variants.sale_price": "" }
                            ]},
                            { $expr: { $lte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, maxPrice] }}
                        ]
                    }
                ];
            }
            
            pipeline.push({ $match: priceMatch });
        }

        pipeline.push({
            $group: {
                _id: "$_id",
                Product_Name: { $first: "$Product_Name" },
                Category: { $first: "$Category" },
                category_id: { $first: "$category_id" },
                Subcategory: { $first: "$Subcategory" },
                description: { $first: "$description" },
                material_care: { $first: "$material_care" },
                tags: { $first: "$tags" },
                gender: { $first: "$gender" },
                Product_type: { $first: "$Product_type" },
                is_popular_products: { $first: "$is_popular_products" },
                stock: { $first: "$stock" },
                status: { $first: "$status" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                variants: { $push: "$variants" }
            }
        });

        pipeline.push({
            $addFields: {
                relevanceScore: {
                    $add: [
                        ...(query ? [{
                            $cond: [
                                { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
                                150, 0
                            ]
                        }] : [0]),
                        
                        ...(query ? [{
                            $cond: [
                                { $regexMatch: { input: { $ifNull: ["$gender", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
                                120, 0
                            ]
                        }] : [0]),
                        
                        ...(query ? [{
                            $cond: [
                                { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
                                100, 0
                            ]
                        }] : [0]),
                        
                        ...(query ? [{
                            $cond: [
                                { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`^${query.trim()}`, 'i') } },
                                80, 0
                            ]
                        }] : [0]),
                        
                        ...(query ? [{
                            $cond: [
                                { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`^${query.trim()}`, 'i') } },
                                70, 0
                            ]
                        }] : [0]),
                        
                        { $cond: [{ $eq: ["$is_popular_products", true] }, 20, 0] }
                    ]
                },
                
                bestPrice: {
                    $min: {
                        $map: {
                            input: "$variants",
                            as: "variant",
                            in: {
                                $cond: [
                                    { $and: [
                                        { $ne: ["$$variant.sale_price", null] },
                                        { $ne: ["$$variant.sale_price", ""] },
                                        { $gt: [{ $convert: { input: "$$variant.sale_price", to: "double", onError: 0 } }, 0] }
                                    ]},
                                    { $convert: { input: "$$variant.sale_price", to: "double", onError: 0 } },
                                    { $convert: { input: "$$variant.price", to: "double", onError: 0 } }
                                ]
                            }
                        }
                    }
                }
            }
        });

        let sortStage = {};
        switch (sort_by) {
            case 'price_asc':
                sortStage = { bestPrice: 1, createdAt: -1 };
                break;
            case 'price_desc':
                sortStage = { bestPrice: -1, createdAt: -1 };
                break;
            case 'name_asc':
                sortStage = { Product_Name: 1 };
                break;
            case 'name_desc':
                sortStage = { Product_Name: -1 };
                break;
            case 'newest':
                sortStage = { createdAt: -1 };
                break;
            case 'oldest':
                sortStage = { createdAt: 1 };
                break;
            case 'popular':
                sortStage = { is_popular_products: -1, createdAt: -1 };
                break;
            case 'relevance':
            default:
                if (query && query.trim()) {
                    sortStage = { relevanceScore: -1, createdAt: -1 };
                } else {
                    sortStage = { createdAt: -1 };
                }
                break;
        }
        
        pipeline.push({ $sort: sortStage });

        const countPipeline = [...pipeline, { $count: "total" }];
        
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limitNum });

        const [products, countResult] = await Promise.all([
            Products.aggregate(pipeline),
            Products.aggregate(countPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalCount / limitNum);

        const processedProducts = products.map(product => {
            const variantsWithDiscount = product.variants.map(variant => {
                const price = parseFloat(variant.price) || 0;
                const salePrice = variant.sale_price && variant.sale_price !== "" ? parseFloat(variant.sale_price) : null;
                const hasDiscount = salePrice && salePrice > 0 && salePrice < price;
                const discountPercentage = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;
                
                return {
                    ...variant,
                    effectivePrice: salePrice && salePrice > 0 ? salePrice : price,
                    originalPrice: price,
                    salePrice: salePrice,
                    hasDiscount,
                    discountPercentage,
                    totalStock: variant.sizes?.reduce((sum, size) => {
                        const stock = parseInt(size.stock) || 0;
                        return sum + stock;
                    }, 0) || 0
                };
            });

            const bestDeal = variantsWithDiscount.reduce((best, current) => 
                current.effectivePrice < best.effectivePrice ? current : best
            );

            return {
                _id: product._id,
                Product_Name: product.Product_Name,
                Category: product.Category,
                category_id: product.category_id,
                Subcategory: product.Subcategory,
                tags: product.tags,
                gender: product.gender,
                Product_type: product.Product_type,
                is_popular_products: product.is_popular_products,
                stock: product.stock,
                status: product.status,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                variants: variantsWithDiscount,
                bestPrice: product.bestPrice,
                bestDeal,
                relevanceScore: product.relevanceScore || 0,
                totalVariants: variantsWithDiscount.length,
                inStock: variantsWithDiscount.some(v => v.totalStock > 0)
            };
        });

        res.status(200).json({
            success: true,
            data: {
                products: processedProducts,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    limit: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                },
                filters: {
                    query: query?.trim() || null,
                    category_id,
                    gender,
                    product_type,
                    min_price,
                    max_price,
                    sort_by
                },
                meta: {
                    searchTerm: query?.trim() || null,
                    resultsFound: totalCount,
                    searchTime: Date.now() - req.startTime || 0
                }
            }
        });

    } catch (error) {
        console.error("Search Products Error:", error);
        res.status(500).json({success: false, error: "An error occurred while searching products"});
    }
};


