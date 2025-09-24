import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Dialog } from "primereact/dialog";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { useEffect, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

export default function Addandeditform(props) {
    const { visible, setVisible, formdata, handlechange, handlesave, handleupdate, hookupsData, customerCategories, swapItems } = props;
    const [variants, setVariants] = useState([{ variant_name: '', variant_images: [], description: '', tags:'', material_care: '', sizes: [], gender: '', Product_type: '',
        price: '', sale_price: '', cost_price: '', stock: 'Inactive', status: 'Active' }]);

    const [hookups, setHookups] = useState({ categories: [], subcategories: [], genders: [], sizes: [], tags: [], producttype: [], headerMenus: [], });

    const [sizePricingMode, setSizePricingMode] = useState(false);

    useEffect(() => {
        if (hookupsData && hookupsData.length > 0) {
            const processedHookups = {
                categories: hookupsData.filter(item => item.Category).map(item => ({ label: item.Category, value: item.Category })),
                subcategories: hookupsData.filter(item => item.Subcategory).map(item => ({ label: item.Subcategory, value: item.Subcategory })),
                genders: hookupsData.filter(item => item.gender).map(item => ({ label: item.gender, value: item.gender })),
                sizes: hookupsData.filter(item => item.sizes).map(item => ({ label: item.sizes, value: item.sizes })),
                tags: hookupsData.filter(item => item.tags).map(item => ({ label: item.tags, value: item.tags })),
                producttype: hookupsData.filter(item => item.Product_type).map(item => ({ label: item.Product_type, value: item.Product_type })),
            };
            setHookups(processedHookups);
        }
    }, [hookupsData]);

    useEffect(() => {
        if (formdata?.variants && formdata.variants.length > 0) {
            setVariants(formdata.variants);
        }
        if (formdata?.sizes && formdata.sizes.length > 0 && formdata.sizes[0].size) {
            setSizePricingMode(true);
        }
    }, [formdata]);

    const handleSizePricingToggle = (enabled) => {
        setSizePricingMode(enabled);
        if (enabled) {
            const sizeObjects = (formdata?.sizes || []).map(size => 
                typeof size === 'string' 
                    ? { size, price: formdata?.price || '', sale_price: formdata?.sale_price || '', cost_price: formdata?.cost_price || '' }
                    : size
            );
            handlechange({ target: { name: 'sizes', value: sizeObjects } });
        } else {
            const sizeStrings = (formdata?.sizes || []).map(size => 
                typeof size === 'object' ? size.size : size
            );
            handlechange({ target: { name: 'sizes', value: sizeStrings } });
        }
    };

    const handleSizeChange = (sizes) => {
        if (sizePricingMode) {
            const sizeObjects = sizes.map(size => ({
                size,
                price: '',
                sale_price: '',
                cost_price: ''
            }));
            handlechange({ target: { name: 'sizes', value: sizeObjects } });
        } else {
            handlechange({ target: { name: 'sizes', value: sizes } });
        }
    };

    const handleSizePriceChange = (sizeIndex, field, value) => {
        const updatedSizes = [...(formdata?.sizes || [])];
        updatedSizes[sizeIndex] = {
            ...updatedSizes[sizeIndex],
            [field]: value
        };
        handlechange({ target: { name: 'sizes', value: updatedSizes } });
    };

    const handleVariantSizePricingToggle = (variantIndex, enabled) => {
        const updatedVariants = [...variants];
        if (enabled) {
            const sizeObjects = (updatedVariants[variantIndex].sizes || []).map(size => 
                typeof size === 'string' 
                    ? { size, price: '', sale_price: '', cost_price: '' }
                    : size
            );
            updatedVariants[variantIndex].sizes = sizeObjects;
            updatedVariants[variantIndex].sizePricingMode = true;
        } else {
            const sizeStrings = (updatedVariants[variantIndex].sizes || []).map(size => 
                typeof size === 'object' ? size.size : size
            );
            updatedVariants[variantIndex].sizes = sizeStrings;
            updatedVariants[variantIndex].sizePricingMode = false;
        }
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

     const handleVariantSizeChange = (variantIndex, sizes) => {
        const updatedVariants = [...variants];
        if (updatedVariants[variantIndex].sizePricingMode) {
            const sizeObjects = sizes.map(size => ({
                size,
                price: '',
                sale_price: '',
                cost_price: ''
            }));
            updatedVariants[variantIndex].sizes = sizeObjects;
        } else {
            updatedVariants[variantIndex].sizes = sizes;
        }
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

    const handleVariantSizePriceChange = (variantIndex, sizeIndex, field, value) => {
        const updatedVariants = [...variants];
        const updatedSizes = [...updatedVariants[variantIndex].sizes];
        updatedSizes[sizeIndex] = {
            ...updatedSizes[sizeIndex],
            [field]: value
        };
        updatedVariants[variantIndex].sizes = updatedSizes;
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).filter(file => 
            file instanceof File && file.type.startsWith('image/')
        );
        
        const existingImages = formdata?.Images?.filter(img => typeof img === 'string') || [];
        const updatedImages = [...existingImages, ...files];
        
        handlechange({ target: { name: 'Images', value: updatedImages } });
    };

    const removeImage = (imageIndex) => {
        const updatedImages = (formdata?.Images || []).filter((_, i) => i !== imageIndex);
        handlechange({ target: { name: 'Images', value: updatedImages } });
    };

    const handleVariantImageChange = (variantIndex, e) => {
        const files = Array.from(e.target.files).filter(file => 
            file instanceof File && file.type.startsWith('image/')
        );
        
        const updatedVariants = [...variants];
        const existingImages = updatedVariants[variantIndex].variant_images?.filter(img => typeof img === 'string') || [];
        updatedVariants[variantIndex].variant_images = [...existingImages, ...files];
        
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

    const addVariant = () => {
        const newVariant = { 
            variant_name: '', 
            variant_images: [], 
            description: '',
            material_care: '',
            tags:'',
            gender: '',
            Product_type: '',
            sizes: [],
             price: '',
            sale_price: '',
            cost_price: '',
            stock: 'Inactive',
            status: 'Active'
        };
        const updatedVariants = [...variants, newVariant];
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

    const removeVariant = (index) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

    const updateVariantField = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].variant_images = updatedVariants[variantIndex].variant_images?.filter((_, i) => i !== imageIndex) || [];
        setVariants(updatedVariants);
        handlechange({ target: { name: 'variants', value: updatedVariants } });
    };



    return (
        <Dialog header="Product Management" visible={visible} maximizable onHide={() => setVisible(false)}   breakpoints={{ "960px": "95vw", "641px": "100vw" }}>
            <div className="p-6  overflow-y-auto">
                <form onSubmit={!formdata?._id ? handlesave : handleupdate} className="space-y-6">
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Product Name *</label>
                                <input type="text" name="Product_Name" value={formdata?.Product_Name || ""} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                                    onChange={handlechange} required placeholder="Enter product name"/>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
                                <Dropdown value={formdata?.Category || ""} options={customerCategories} onChange={(e) => {
                                        const selectedCategory = customerCategories.find(cat => cat.value === e.value);
                                        handlechange({ target: { name: 'Category', value: e.value } });
                                        if (selectedCategory?.id) {
                                            handlechange({ target: { name: 'category_id', value: selectedCategory.id } });
                                        }
                                    }} placeholder="Select category" className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" required />
                            </div>

                            {/* <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Subcategory *</label>
                                <Dropdown 
                                    value={formdata?.Subcategory || ""} 
                                    options={hookups.subcategories}
                                    onChange={(e) => handlechange({ target: { name: 'Subcategory', value: e.value } })}
                                    placeholder="Select subcategory"
                                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div> */}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Description *</label>
                                <SunEditor setContents={formdata?.description || ''} onChange={(content) => handlechange({ target: { name: 'description', value: content } })}
                                        setOptions={{
                                            defaultStyle: "font-family: Arial, sans-serif;",
                                            font: ['Arial'],
                                            buttonList: [
                                                ['undo', 'redo', 'fontSize', 'formatBlock'],
                                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                                                ['fontColor', 'hiliteColor', 'textStyle'],
                                                ['align', 'list', 'lineHeight'],
                                                ['outdent', 'indent'],
                                            ]
                                        }}
                                        height="150px"
                                    />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Material Care *</label>
                                <SunEditor setContents={formdata?.material_care || ''} onChange={(content) => handlechange({ target: { name: 'material_care', value: content } })}
                                        setOptions={{
                                            defaultStyle: "font-family: Arial, sans-serif;",
                                            font: ['Arial'],
                                            buttonList: [
                                                ['undo', 'redo', 'fontSize', 'formatBlock'],
                                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                                                ['fontColor', 'hiliteColor', 'textStyle'],
                                                ['align', 'list', 'lineHeight'],
                                                ['outdent', 'indent'],
                                            ]
                                        }}
                                        height="150px"
                                    />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Gender *</label>
                                 <Dropdown 
                                    value={formdata?.gender || ""} 
                                    options={hookups.genders}
                                    onChange={(e) => handlechange({ target: { name: 'gender', value: e.value } })}
                                    placeholder="Select gender"
                                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Product type *</label>
                                <Dropdown 
                                    value={formdata?.Product_type || ""} 
                                    options={hookups.producttype}
                                    onChange={(e) => handlechange({ target: { name: 'Product_type', value: e.value } })}
                                    placeholder="Select product type"
                                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Tags *</label>
                                <Dropdown 
                                    value={formdata?.tags || ""} 
                                    options={hookups.tags}
                                    onChange={(e) => handlechange({ target: { name: 'tags', value: e.value } })}
                                    placeholder="Select tag"
                                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            {/* <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-white col-span-full">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-semibold text-gray-800">Available Sizes</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Size-specific pricing</span>
                                        <input 
                                            type="checkbox" 
                                            checked={sizePricingMode}
                                            onChange={(e) => handleSizePricingToggle(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </div>

                                {!sizePricingMode ? (
                                    <MultiSelect 
                                        value={formdata?.sizes || []} 
                                        options={hookups.sizes}
                                        onChange={(e) => handleSizeChange(e.value)}
                                        placeholder="Select sizes"
                                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                        display="chip"
                                    />
                                ) : (
                                    <div>
                                        <MultiSelect 
                                            value={(formdata?.sizes || []).map(s => typeof s === 'object' ? s.size : s)} 
                                            options={hookups.sizes}
                                            onChange={(e) => handleSizeChange(e.value)}
                                            placeholder="Select sizes"
                                            className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black mb-4"
                                            display="chip"
                                        />
                                        
                                        {(formdata?.sizes || []).map((sizeObj, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-2 mb-2 p-3 bg-gray-50 rounded">
                                                <div className="font-medium text-sm text-gray-700 flex items-center">
                                                    {typeof sizeObj === 'object' ? sizeObj.size : sizeObj}
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={typeof sizeObj === 'object' ? sizeObj.price : ''}
                                                    onChange={(e) => handleSizePriceChange(index, 'price', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Sale Price"
                                                    value={typeof sizeObj === 'object' ? sizeObj.sale_price : ''}
                                                    onChange={(e) => handleSizePriceChange(index, 'sale_price', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Cost Price"
                                                    value={typeof sizeObj === 'object' ? sizeObj.cost_price : ''}
                                                    onChange={(e) => handleSizePriceChange(index, 'cost_price', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div> */}

                            {/* {!sizePricingMode && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Price *</label>
                                        <input type="number" value={formdata?.price || ''} onChange={(e) => handlechange({ target: { name: 'price', value: e.target.value } })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                                            placeholder="0.00" required/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Sale Price *</label>
                                        <input type="number" value={formdata?.sale_price || ''} onChange={(e) => handlechange({ target: { name: 'sale_price', value: e.target.value } })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                                            placeholder="0.00" required/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Cost of the product *</label>
                                        <input type="number" value={formdata?.cost_price || ''} onChange={(e) => handlechange({ target: { name: 'cost_price', value: e.target.value } })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                                            placeholder="0.00" required/>
                                    </div>
                                </div>
                            )} */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Status *</label>
                                <select name="status" value={formdata?.status || 'Active'} onChange={handlechange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" required>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Stock Status *</label>
                                <select name="stock" value={formdata?.stock || 'Inactive'} onChange={handlechange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" required>
                                    <option value="Active">In Stock</option>
                                    <option value="Inactive">Out of Stock</option>
                                </select>
                            </div>
                           {/* <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Show in Popular Products (Home)</label>
                                <input type="checkbox" 
                                    name="is_popular_products"
                                    checked={formdata?.is_popular_products || false} 
                                    onChange={handlechange}
                                    className="w-5 h-5 border border-gray-300 rounded" />
                            </div> */}
                        </div>

                        {/* <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Product Images</label>
                            
                            {formdata?.Images?.length > 0 && (
                                <div className="mb-3 flex gap-2">
                                    {formdata.Images.map((image, imgIndex) => {
                                        const imageUrl = image instanceof File ? URL.createObjectURL(image) : `${apiurl()}/${image}`;
                                        return (
                                            <div key={imgIndex} className="relative group">
                                                <img src={imageUrl} alt={`Product ${imgIndex + 1}`} 
                                                    className="h-20 w-20 object-cover rounded border"/>
                                                <button type="button" onClick={() => removeImage(imgIndex)} 
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600">×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            
                            <input type="file" multiple onChange={handleImageChange} accept="image/*" 
                                className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-sm hover:border-gray-400"/>
                        </div> */}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Product Variants</h3>
                            <button type="button" onClick={addVariant} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Add Variant</button>
                        </div>

                        {variants.map((variant, index) => (
                            <div key={index} className="bg-white p-4 rounded border mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800">Variant {index + 1}</h4>
                                    {variants.length > 1 && (
                                        <>
                                            <div>
                                                {index > 0 && ( <button type="button" onClick={() => swapItems(index, index - 1)} className="me-2 py-1 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden">
                                                    ⬆️ up
                                                </button>)}
                                                {index < variants.length - 1 && ( <button type='button'  className="py-1 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden" onClick={() => swapItems(index, index + 1)}>⬇️ Down</button> )}
                                            </div>

                                            <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition-colors">Remove</button>
                                        </>
                                    )}
                                </div>

                                <div className='mb-2'>
                                    <label className="block text-sm font-medium mb-1">Variant Name *</label>
                                    <input type="text" value={variant.variant_name || ''} onChange={(e) => updateVariantField(index, 'variant_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" 
                                        placeholder="e.g., Red, Blue, Green" required/>
                                </div>
                                {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                    <div className='mb-2'>
                                        <label className="block text-sm font-medium mb-1">Material Care</label>
                                         <SunEditor setContents={variant.material_care || ''} onChange={(content) => updateVariantField(index, 'material_care', content)}
                                            setOptions={{
                                                defaultStyle: "font-family: Arial, sans-serif;",
                                                font: ['Arial'],
                                                buttonList: [
                                                    ['undo', 'redo', 'fontSize', 'formatBlock'],
                                                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                                                    ['fontColor', 'hiliteColor', 'textStyle'],
                                                    ['align', 'list', 'lineHeight'],
                                                    ['outdent', 'indent'],
                                                ]
                                            }}
                                            height="150px"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                            <SunEditor setContents={variant.description || ''} onChange={(content) => updateVariantField(index, 'description', content)}
                                                setOptions={{
                                                    defaultStyle: "font-family: Arial, sans-serif;",
                                                    font: ['Arial'],
                                                    buttonList: [
                                                        ['undo', 'redo', 'fontSize', 'formatBlock'],
                                                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                                                        ['fontColor', 'hiliteColor', 'textStyle'],
                                                        ['align', 'list', 'lineHeight'],
                                                        ['outdent', 'indent'],
                                                    ]
                                                }}
                                                height="150px"
                                            />
                                    </div>
                                </div> */}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Product type</label>
                                        <Dropdown 
                                            value={formdata?.Product_type || ""} 
                                            options={hookups.producttype}
                                            onChange={(e) => updateVariantField(index, 'Product_type', e.target.value)}
                                            placeholder="Select product type"
                                            className="w-full px-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Gender</label>
                                          <Dropdown 
                                            value={variant.gender || ""} 
                                            options={hookups.genders}
                                            onChange={(e) => updateVariantField(index, 'gender', e.value)}
                                            placeholder="Select gender"
                                            className="w-full px-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div> */}
                                    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50 col-span-full">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-medium">Available Sizes</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-600">Size-specific pricing</span>
                                                <input type="checkbox" checked={variant.sizePricingMode || false} onChange={(e) => handleVariantSizePricingToggle(index, e.target.checked)}
                                                    className="w-4 h-4"/>
                                            </div>
                                        </div>

                                        {!variant.sizePricingMode ? (
                                            <MultiSelect value={variant.sizes || []} options={hookups.sizes} onChange={(e) => handleVariantSizeChange(index, e.value)}
                                                placeholder="Select sizes" className="w-full px-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" display="chip"
                                            />
                                        ) : (
                                            <div>
                                                <MultiSelect value={(variant.sizes || []).map(s => typeof s === 'object' ? s.size : s)} options={hookups.sizes}
                                                    onChange={(e) => handleVariantSizeChange(index, e.value)} placeholder="Select sizes"
                                                    className="w-full px-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 mb-3" display="chip" 
                                                />
                                                <div className="grid grid-cols-5 gap-2 mb-2 p-2 bg-white rounded">
                                                    <div> Size </div>
                                                    <div>Stock</div>
                                                    <div>Price</div>
                                                    <div> Sale Price </div>
                                                    <div>Cost Price</div>
                                                </div>
                                                {(variant.sizes || []).map((sizeObj, sizeIndex) => (
                                                    <div key={sizeIndex} className="grid grid-cols-5 gap-2 mb-2 p-2 bg-white rounded">
                                                        <div className="font-medium text-xs text-gray-700 flex items-center">
                                                            {typeof sizeObj === 'object' ? sizeObj.size : sizeObj}
                                                        </div>
                                                        <input type="number" placeholder="Stock" value={typeof sizeObj === 'object' ? sizeObj.Stock : ''}
                                                            onChange={(e) => handleVariantSizePriceChange(index, sizeIndex, 'Stock', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                                        />
                                                        <input type="number" placeholder="Price" value={typeof sizeObj === 'object' ? sizeObj.price : ''}
                                                            onChange={(e) => handleVariantSizePriceChange(index, sizeIndex, 'price', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                                        />
                                                        <input type="number" placeholder="Sale Price" value={typeof sizeObj === 'object' ? sizeObj.sale_price : ''}
                                                            onChange={(e) => handleVariantSizePriceChange(index, sizeIndex, 'sale_price', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                                        />
                                                        <input type="number" placeholder="Cost Price" value={typeof sizeObj === 'object' ? sizeObj.cost_price : ''}
                                                            onChange={(e) => handleVariantSizePriceChange(index, sizeIndex, 'cost_price', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {!variant.sizePricingMode && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Price</label>
                                                <input type="number" value={variant.price || ''} onChange={(e) => updateVariantField(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" placeholder="0.00"/>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Sale Price</label>
                                                <input type="number" value={variant.sale_price || ''} onChange={(e) => updateVariantField(index, 'sale_price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" placeholder="0.00"/>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Cost of the Product</label>
                                                <input type="number" value={variant.cost_price || ''} onChange={(e) => updateVariantField(index, 'cost_price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" placeholder="0.00"/>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <select value={variant.status || 'Active'} onChange={(e) => updateVariantField(index, 'status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500">
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Stock Status</label>
                                        <select value={variant.stock || 'Inactive'} onChange={(e) => updateVariantField(index, 'stock', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500">
                                            <option value="Active">In Stock</option>
                                            <option value="Inactive">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Variant Images</label>
                                    
                                    {variant.variant_images?.length > 0 && (
                                        <div className="mb-2 flex gap-2">
                                            {variant.variant_images.map((image, imgIndex) => {
                                                const imageUrl = image instanceof File ? URL.createObjectURL(image) : `${apiurl()}/${image}`;
                                                return (
                                                    <div key={imgIndex} className="relative group">
                                                        <img src={imageUrl} alt={`Variant ${imgIndex + 1}`} 
                                                            className="w-20 h-20 object-cover rounded border"/>
                                                        <button type="button" onClick={() => removeVariantImage(index, imgIndex)} 
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs hover:bg-red-600">×</button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    <input type="file" multiple onChange={(e) => handleVariantImageChange(index, e)} accept="image/*" 
                                        className="w-full p-2 border border-dashed border-gray-300 rounded text-sm hover:border-gray-400"/>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={() => setVisible(false)} 
                            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" 
                            className="px-8 py-3 text-white bg-black rounded hover:bg-gray-800 transition-colors">
                            {!formdata?._id ? 'Save Product' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}