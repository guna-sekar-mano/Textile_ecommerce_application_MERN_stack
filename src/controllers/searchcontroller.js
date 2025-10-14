// import mongoose from "mongoose";
// import Products from "../models/productmodel.js";

// export const searchProducts = async (req, res) => {
//     try {
//         const { query, category_id, gender, product_type, min_price, max_price, sort_by = 'relevance', limit = 20, page = 1 } = req.query;

//         const pageNum = Math.max(1, parseInt(page));
//         const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
//         const skip = (pageNum - 1) * limitNum;

//         let pipeline = [];

//         let matchStage = {
//             status: 'Active',
//             variants: { $elemMatch: { status: 'Active',sizes: { $exists: true, $ne: [] }} 
//             }
//         };

//         if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
//             matchStage.category_id = new mongoose.Types.ObjectId(category_id);
//         }

//         if (gender) {
//             matchStage.$and = matchStage.$and || [];
//             matchStage.$and.push({
//                 $or: [
//                     { gender: { $regex: new RegExp(`^${gender}$`, 'i') } },
//                     { 'variants.gender': { $regex: new RegExp(`^${gender}$`, 'i') } }
//                 ]
//             });
//         }

//         if (product_type) {
//             matchStage.$and = matchStage.$and || [];
//             matchStage.$and.push({
//                 $or: [
//                     { Product_type: { $regex: new RegExp(product_type, 'i') } },
//                     { 'variants.Product_type': { $regex: new RegExp(product_type, 'i') } }
//                 ]
//             });
//         }

//         if (query && query.trim()) {
//             const searchQuery = query.trim();
//             const searchTerms = searchQuery.split(/\s+/);
            
//             const exactMatch = new RegExp(`^${searchQuery}$`, 'i');
//             const startsWithMatch = new RegExp(`^${searchQuery}`, 'i');
//             const containsMatch = new RegExp(searchQuery.replace(/\s+/g, '.*'), 'i');
//             const wordMatches = searchTerms.map(term => new RegExp(term, 'i'));

//             const searchConditions = [
//                 { Product_type: exactMatch },
                
//                 { 'variants.Product_type': exactMatch },
                
//                 { gender: exactMatch },
                
//                 { 'variants.gender': exactMatch },
                
//                 { Product_Name: exactMatch },
                
//                 { Product_type: startsWithMatch },
                
//                 { Product_Name: startsWithMatch },
                
//                 { Product_Name: containsMatch },
                
//                 { Category: { $in: wordMatches } },
                
//                 { tags: { $in: wordMatches } },
                
//                 { 'variants.tags': { $in: wordMatches } },
                
//                 { description: containsMatch },
                
//                 { 'variants.description': containsMatch },
                
//                 { 'variants.variant_name': { $in: wordMatches } },
                
//                 { material_care: containsMatch },
                
//                 { 'variants.material_care': containsMatch },
                
//                 ...searchTerms.map(term => {
//                     const fuzzyTerm = new RegExp(term.substring(0, Math.max(3, Math.floor(term.length * 0.7))), 'i');
//                     return {
//                         $or: [
//                             { Product_Name: fuzzyTerm },
//                             { Product_type: fuzzyTerm },
//                             { gender: fuzzyTerm },
//                             { tags: fuzzyTerm },
//                             { 'variants.Product_type': fuzzyTerm },
//                             { 'variants.gender': fuzzyTerm },
//                             { 'variants.tags': fuzzyTerm }
//                         ]
//                     };
//                 })
//             ];

//             if (matchStage.$and) {
//                 matchStage.$and.push({ $or: searchConditions });
//             } else {
//                 matchStage.$or = searchConditions;
//             }
//         }

//         pipeline.push({ $match: matchStage });

//         pipeline.push({ $unwind: "$variants" });
//         pipeline.push({ $match: { "variants.status": "Active" } });

//         if (min_price || max_price) {
//             let priceMatch = {};
            
//             const minPrice = min_price ? parseFloat(min_price) : null;
//             const maxPrice = max_price ? parseFloat(max_price) : null;
            
//             if (minPrice && maxPrice) {
//                 priceMatch.$or = [
//                     { 
//                         $and: [
//                             { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
//                             { $expr: { 
//                                 $and: [
//                                     { $gte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, minPrice] },
//                                     { $lte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, maxPrice] }
//                                 ]
//                             }}
//                         ]
//                     },
//                     { 
//                         $and: [
//                             { $or: [
//                                 { "variants.sale_price": { $exists: false } },
//                                 { "variants.sale_price": null },
//                                 { "variants.sale_price": "" }
//                             ]},
//                             { $expr: { 
//                                 $and: [
//                                     { $gte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, minPrice] },
//                                     { $lte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, maxPrice] }
//                                 ]
//                             }}
//                         ]
//                     }
//                 ];
//             } else if (minPrice) {
//                 priceMatch.$or = [
//                     { 
//                         $and: [
//                             { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
//                             { $expr: { $gte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, minPrice] }}
//                         ]
//                     },
//                     { 
//                         $and: [
//                             { $or: [
//                                 { "variants.sale_price": { $exists: false } },
//                                 { "variants.sale_price": null },
//                                 { "variants.sale_price": "" }
//                             ]},
//                             { $expr: { $gte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, minPrice] }}
//                         ]
//                     }
//                 ];
//             } else if (maxPrice) {
//                 priceMatch.$or = [
//                     { 
//                         $and: [
//                             { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
//                             { $expr: { $lte: [{ $convert: { input: "$variants.sale_price", to: "double", onError: 0 } }, maxPrice] }}
//                         ]
//                     },
//                     { 
//                         $and: [
//                             { $or: [
//                                 { "variants.sale_price": { $exists: false } },
//                                 { "variants.sale_price": null },
//                                 { "variants.sale_price": "" }
//                             ]},
//                             { $expr: { $lte: [{ $convert: { input: "$variants.price", to: "double", onError: 0 } }, maxPrice] }}
//                         ]
//                     }
//                 ];
//             }
            
//             pipeline.push({ $match: priceMatch });
//         }

//         pipeline.push({
//             $group: {
//                 _id: "$_id",
//                 Product_Name: { $first: "$Product_Name" },
//                 Category: { $first: "$Category" },
//                 category_id: { $first: "$category_id" },
//                 Subcategory: { $first: "$Subcategory" },
//                 description: { $first: "$description" },
//                 material_care: { $first: "$material_care" },
//                 tags: { $first: "$tags" },
//                 gender: { $first: "$gender" },
//                 Product_type: { $first: "$Product_type" },
//                 is_popular_products: { $first: "$is_popular_products" },
//                 stock: { $first: "$stock" },
//                 status: { $first: "$status" },
//                 createdAt: { $first: "$createdAt" },
//                 updatedAt: { $first: "$updatedAt" },
//                 variants: { $push: "$variants" }
//             }
//         });

//         pipeline.push({
//             $addFields: {
//                 relevanceScore: {
//                     $add: [
//                         ...(query ? [{
//                             $cond: [
//                                 { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
//                                 150, 0
//                             ]
//                         }] : [0]),
                        
//                         ...(query ? [{
//                             $cond: [
//                                 { $regexMatch: { input: { $ifNull: ["$gender", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
//                                 120, 0
//                             ]
//                         }] : [0]),
                        
//                         ...(query ? [{
//                             $cond: [
//                                 { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`^${query.trim()}$`, 'i') } },
//                                 100, 0
//                             ]
//                         }] : [0]),
                        
//                         ...(query ? [{
//                             $cond: [
//                                 { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`^${query.trim()}`, 'i') } },
//                                 80, 0
//                             ]
//                         }] : [0]),
                        
//                         ...(query ? [{
//                             $cond: [
//                                 { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`^${query.trim()}`, 'i') } },
//                                 70, 0
//                             ]
//                         }] : [0]),
                        
//                         { $cond: [{ $eq: ["$is_popular_products", true] }, 20, 0] }
//                     ]
//                 },
                
//                 bestPrice: {
//                     $min: {
//                         $map: {
//                             input: "$variants",
//                             as: "variant",
//                             in: {
//                                 $cond: [
//                                     { $and: [
//                                         { $ne: ["$$variant.sale_price", null] },
//                                         { $ne: ["$$variant.sale_price", ""] },
//                                         { $gt: [{ $convert: { input: "$$variant.sale_price", to: "double", onError: 0 } }, 0] }
//                                     ]},
//                                     { $convert: { input: "$$variant.sale_price", to: "double", onError: 0 } },
//                                     { $convert: { input: "$$variant.price", to: "double", onError: 0 } }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         let sortStage = {};
//         switch (sort_by) {
//             case 'price_asc':
//                 sortStage = { bestPrice: 1, createdAt: -1 };
//                 break;
//             case 'price_desc':
//                 sortStage = { bestPrice: -1, createdAt: -1 };
//                 break;
//             case 'name_asc':
//                 sortStage = { Product_Name: 1 };
//                 break;
//             case 'name_desc':
//                 sortStage = { Product_Name: -1 };
//                 break;
//             case 'newest':
//                 sortStage = { createdAt: -1 };
//                 break;
//             case 'oldest':
//                 sortStage = { createdAt: 1 };
//                 break;
//             case 'popular':
//                 sortStage = { is_popular_products: -1, createdAt: -1 };
//                 break;
//             case 'relevance':
//             default:
//                 if (query && query.trim()) {
//                     sortStage = { relevanceScore: -1, createdAt: -1 };
//                 } else {
//                     sortStage = { createdAt: -1 };
//                 }
//                 break;
//         }
        
//         pipeline.push({ $sort: sortStage });

//         const countPipeline = [...pipeline, { $count: "total" }];
        
//         pipeline.push({ $skip: skip });
//         pipeline.push({ $limit: limitNum });

//         const [products, countResult] = await Promise.all([
//             Products.aggregate(pipeline),
//             Products.aggregate(countPipeline)
//         ]);

//         const totalCount = countResult.length > 0 ? countResult[0].total : 0;
//         const totalPages = Math.ceil(totalCount / limitNum);

//         const processedProducts = products.map(product => {
//             const variantsWithDiscount = product.variants.map(variant => {
//                 const price = parseFloat(variant.price) || 0;
//                 const salePrice = variant.sale_price && variant.sale_price !== "" ? parseFloat(variant.sale_price) : null;
//                 const hasDiscount = salePrice && salePrice > 0 && salePrice < price;
//                 const discountPercentage = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;
                
//                 return {
//                     ...variant,
//                     effectivePrice: salePrice && salePrice > 0 ? salePrice : price,
//                     originalPrice: price,
//                     salePrice: salePrice,
//                     hasDiscount,
//                     discountPercentage,
//                     totalStock: variant.sizes?.reduce((sum, size) => {
//                         const stock = parseInt(size.stock) || 0;
//                         return sum + stock;
//                     }, 0) || 0
//                 };
//             });

//             const bestDeal = variantsWithDiscount.reduce((best, current) => 
//                 current.effectivePrice < best.effectivePrice ? current : best
//             );

//             return {
//                 _id: product._id,
//                 Product_Name: product.Product_Name,
//                 Category: product.Category,
//                 category_id: product.category_id,
//                 Subcategory: product.Subcategory,
//                 tags: product.tags,
//                 gender: product.gender,
//                 Product_type: product.Product_type,
//                 is_popular_products: product.is_popular_products,
//                 stock: product.stock,
//                 status: product.status,
//                 createdAt: product.createdAt,
//                 updatedAt: product.updatedAt,
//                 variants: variantsWithDiscount,
//                 bestPrice: product.bestPrice,
//                 bestDeal,
//                 relevanceScore: product.relevanceScore || 0,
//                 totalVariants: variantsWithDiscount.length,
//                 inStock: variantsWithDiscount.some(v => v.totalStock > 0)
//             };
//         });

//         res.status(200).json({
//             success: true,
//             data: {
//                 products: processedProducts,
//                 pagination: {
//                     currentPage: pageNum,
//                     totalPages,
//                     totalCount,
//                     limit: limitNum,
//                     hasNext: pageNum < totalPages,
//                     hasPrev: pageNum > 1
//                 },
//                 filters: {
//                     query: query?.trim() || null,
//                     category_id,
//                     gender,
//                     product_type,
//                     min_price,
//                     max_price,
//                     sort_by
//                 },
//                 meta: {
//                     searchTerm: query?.trim() || null,
//                     resultsFound: totalCount,
//                     searchTime: Date.now() - req.startTime || 0
//                 }
//             }
//         });

//     } catch (error) {
//         console.error("Search Products Error:", error);
//         res.status(500).json({success: false, error: "An error occurred while searching products"});
//     }
// };

        // Pagination setup

import mongoose from "mongoose";
import Products from "../models/productmodel.js";

export const searchProducts = async (req, res) => {
    try {
        const {
            query,
            category_id,
            gender,
            product_type,
            color,
            min_price,
            max_price,
            sort_by = 'relevance',
            limit = 20,
            page = 1
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const matchStage = buildMatchStage({ query, category_id, gender, product_type, color });
        const pipeline = buildAggregationPipeline({ matchStage, min_price, max_price, sort_by, query, skip, limitNum });

        const [products, countResult] = await Promise.all([
            Products.aggregate(pipeline),
            Products.aggregate([...pipeline, { $count: "total" }])
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalCount / limitNum);

        const processedProducts = processProducts(products);

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
                filters: { query, category_id, gender, product_type, color, min_price, max_price, sort_by },
                meta: {
                    searchTerm: query?.trim() || null,
                    resultsFound: totalCount,
                    searchTime: Date.now() - (req.startTime || Date.now())
                }
            }
        });

    } catch (error) {
        console.error("Search Products Error:", error);
        res.status(500).json({ success: false, error: "An error occurred while searching products" });
    }
};

const buildMatchStage = ({ query, category_id, gender, product_type, color }) => {
    const matchStage = {
        status: 'Active',
        variants: { 
            $elemMatch: { 
                status: 'Active', 
                sizes: { $exists: true, $ne: [] } 
            }
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
                { Product_type: { $regex: new RegExp(`^${product_type}$`, 'i') } },
                { 'variants.Product_type': { $regex: new RegExp(`^${product_type}$`, 'i') } }
            ]
        });
    }

    if (color) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({
            $or: [
                { 'variants.variant_color': { $regex: new RegExp(`^${color}$`, 'i') } },
                { 'variants.variant_color_code': { $regex: new RegExp(color, 'i') } }
            ]
        });
    }

    if (query && query.trim()) {
        const searchConditions = buildSearchConditions(query.trim());
        
        if (matchStage.$and) {
            matchStage.$and.push({ $or: searchConditions });
        } else {
            matchStage.$or = searchConditions;
        }
    }

    return matchStage;
};

const buildSearchConditions = (searchQuery) => {
    const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);
    
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const escapedQuery = escapeRegex(searchQuery);
    const escapedTerms = searchTerms.map(term => escapeRegex(term));

    const exactPhraseConditions = [
        { Product_Name: new RegExp(`^${escapedQuery}$`, 'i') },
        { Product_Name: new RegExp(`\\b${escapedQuery}\\b`, 'i') },
        
        { Product_type: new RegExp(`^${escapedQuery}$`, 'i') },
        { Product_type: new RegExp(`\\b${escapedQuery}\\b`, 'i') },
        
        { 'variants.Product_type': new RegExp(`^${escapedQuery}$`, 'i') },
        { 'variants.Product_type': new RegExp(`\\b${escapedQuery}\\b`, 'i') },
        
        // Exact gender match
        { gender: new RegExp(`^${escapedQuery}$`, 'i') },
        { 'variants.gender': new RegExp(`^${escapedQuery}$`, 'i') }
    ];

    const individualWordConditions = escapedTerms.flatMap(term => [
        { Product_Name: new RegExp(`\\b${term}\\b`, 'i') },
        
        { Product_type: new RegExp(`\\b${term}\\b`, 'i') },
        { 'variants.Product_type': new RegExp(`\\b${term}\\b`, 'i') },
        
        { Category: new RegExp(`\\b${term}\\b`, 'i') },
        { tags: new RegExp(`\\b${term}\\b`, 'i') },
        { 'variants.tags': new RegExp(`\\b${term}\\b`, 'i') },
        
        { 'variants.variant_name': new RegExp(`\\b${term}\\b`, 'i') },
        { 'variants.variant_color': new RegExp(`\\b${term}\\b`, 'i') }
    ]);

    const containsConditions = searchQuery.length >= 4 ? [
        { Product_Name: new RegExp(escapedQuery, 'i') },
        { description: new RegExp(escapedQuery, 'i') },
        { 'variants.description': new RegExp(escapedQuery, 'i') }
    ] : [];

    const fuzzyConditions = escapedTerms
        .filter(term => term.length >= 4)
        .flatMap(term => {
            const fuzzyTerm = term.substring(0, Math.max(3, Math.floor(term.length * 0.7)));
            return [
                { Product_Name: new RegExp(fuzzyTerm, 'i') },
                { Product_type: new RegExp(fuzzyTerm, 'i') },
                { tags: new RegExp(fuzzyTerm, 'i') }
            ];
        });

    return [
        ...exactPhraseConditions,
        ...individualWordConditions,
        ...containsConditions,
        ...fuzzyConditions
    ];
};

const buildAggregationPipeline = ({ matchStage, min_price, max_price, sort_by, query, skip, limitNum }) => {
    const pipeline = [
        { $match: matchStage },
        { $unwind: "$variants" },
        { $match: { "variants.status": "Active" } }
    ];

    if (min_price || max_price) {
        const priceMatch = buildPriceMatchStage(min_price, max_price);
        if (Object.keys(priceMatch).length > 0) {
            pipeline.push({ $match: priceMatch });
        }
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
            Router_Link: { $first: "$Router_Link" },
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
            relevanceScore: calculateRelevanceScore(query),
            bestPrice: calculateBestPrice()
        }
    });

    pipeline.push({ $sort: buildSortStage(sort_by, query) });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    return pipeline;
};

const buildPriceMatchStage = (min_price, max_price) => {
    const minPrice = min_price ? parseFloat(min_price) : null;
    const maxPrice = max_price ? parseFloat(max_price) : null;
    
    if (!minPrice && !maxPrice) return {};

    const priceMatch = { $or: [] };

    const createPriceCondition = (field, min, max) => {
        const condition = { $expr: {} };
        if (min !== null) condition.$expr.$gte = [{ $convert: { input: field, to: "double", onError: 0 } }, min];
        if (max !== null) condition.$expr.$lte = [{ $convert: { input: field, to: "double", onError: 0 } }, max];
        return condition;
    };

    priceMatch.$or.push({
        $and: [
            { "variants.sale_price": { $exists: true, $ne: null, $ne: "" } },
            createPriceCondition("$variants.sale_price", minPrice, maxPrice)
        ]
    });

    priceMatch.$or.push({
        $and: [
            { 
                $or: [
                    { "variants.sale_price": { $exists: false } },
                    { "variants.sale_price": null },
                    { "variants.sale_price": "" }
                ]
            },
            createPriceCondition("$variants.price", minPrice, maxPrice)
        ]
    });

    return priceMatch;
};

const calculateRelevanceScore = (query) => {
    if (!query) return 0;

    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedQuery = escapeRegex(query);

    return {
        $add: [
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`^${escapedQuery}$`, 'i') } },
                    200, 0
                ]
            },
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`^${escapedQuery}$`, 'i') } },
                    180, 0
                ]
            },
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`\\b${escapedQuery}\\b`, 'i') } },
                    150, 0
                ]
            },
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_type", ""] }, regex: new RegExp(`\\b${escapedQuery}\\b`, 'i') } },
                    130, 0
                ]
            },
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(`\\b${escapedQuery}`, 'i') } },
                    100, 0
                ]
            },
            {
                $cond: [
                    { $regexMatch: { input: { $ifNull: ["$Product_Name", ""] }, regex: new RegExp(escapedQuery, 'i') } },
                    50, 0
                ]
            },
            { $cond: [{ $eq: ["$is_popular_products", true] }, 20, 0] }
        ]
    };
};

const calculateBestPrice = () => ({
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
});

const buildSortStage = (sort_by, query) => {
    switch (sort_by) {
        case 'price_asc':
            return { bestPrice: 1, createdAt: -1 };
        case 'price_desc':
            return { bestPrice: -1, createdAt: -1 };
        case 'name_asc':
            return { Product_Name: 1 };
        case 'name_desc':
            return { Product_Name: -1 };
        case 'newest':
            return { createdAt: -1 };
        case 'oldest':
            return { createdAt: 1 };
        case 'popular':
            return { is_popular_products: -1, createdAt: -1 };
        case 'relevance':
        default:
            return query && query.trim() ? 
                { relevanceScore: -1, createdAt: -1 } : 
                { createdAt: -1 };
    }
};

const processProducts = (products) => {
    return products.map(product => {
        const variantsWithDiscount = product.variants.map(variant => {
            const price = parseFloat(variant.price) || 0;
            const salePrice = variant.sale_price && variant.sale_price !== "" ? 
                parseFloat(variant.sale_price) : null;
            const hasDiscount = salePrice && salePrice > 0 && salePrice < price;
            const discountPercentage = hasDiscount ? 
                Math.round(((price - salePrice) / price) * 100) : 0;
            
            return {
                ...variant,
                effectivePrice: salePrice && salePrice > 0 ? salePrice : price,
                originalPrice: price,
                salePrice,
                hasDiscount,
                discountPercentage,
                totalStock: variant.sizes?.reduce((sum, size) => 
                    sum + (parseInt(size.stock) || 0), 0) || 0
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
             Router_Link: product.Router_Link,
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
};