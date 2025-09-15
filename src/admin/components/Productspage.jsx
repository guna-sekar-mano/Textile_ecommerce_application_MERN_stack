import { useCallback, useEffect, useState } from "react";
import Addandeditform from "../shared/components/Products/Addandeditform";
import Tableheadpanel from "../shared/components/Products/Tableheadpanel";
import { apideleteproducts, apigetallproducts, apisaveProducts, apiupdateproductss } from "../shared/services/apiproducts/apiproducts";
import toast from "react-hot-toast";
import Tableview from "../shared/components/Products/Tableview";
import Cuspagination from "../hooks/CustomPagination";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getallHookupsforProduct } from "../shared/services/apihookups/apihookups";
import { getallcustomercategory } from "../../shared/services/apiCustomercategory/apicustomercategory";

export default function Productspage() {
    const [formdata, setFormdata] = useState({});
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState();
    const [customerCategories, setCustomerCategories] = useState([]);

    let isMounted = true;

    const openform = () => {
        setFormdata({
            Product_Name: '',
            Category: '',
            Subcategory: '',
            header_menu: {
                main_title: '',       
                subtitle: '',         
                collection_name: ''
            },
            Images: [],
            description: '',
            material_care: '',
            sizes: [],
            gender: '',
            Product_type: '',
            price: '',
            sale_price: '',
            cost_price: '',
            is_popular_products: false,
            stock: 'Inactive',
            status: 'Active',
            variants: [{ 
                variant_name: '', 
                variant_images: [], 
                description: '',
                material_care: '',
                sizes: [],
                gender: '',
                Product_type: '',
                price: '',
                sale_price: '',
                cost_price: '',
                stock: 'Inactive',
                status: 'Active'
            }]
        });
        setVisible(true);
    }

    const onPage = (page) => {
        setPage(page);
        setFirst(rows * (page - 1));
        setRows(rows);
    };

    const resetForm = () => {
        setFormdata({});
        setVisible(false);
    }

    const normalizeSizesData = (sizesData) => {
        if (!sizesData || sizesData.length === 0) return [];
        
        if (typeof sizesData[0] === 'object' && sizesData[0].size) {
            return sizesData; // Already in correct format
        }
        
        return sizesData;
    };

    const normalizeVariantsData = (variants) => {
        if (!variants || variants.length === 0) return [];
        
        return variants.map(variant => ({
            ...variant,
            sizes: normalizeSizesData(variant.sizes)
        }));
    };


    const processFormDataForSubmission = (data) => {
        const processedData = { ...data };
        
        if (processedData.sizes) {
            if (Array.isArray(processedData.sizes)) {
                processedData.sizes = processedData.sizes.map(size => {
                    if (typeof size === 'string') {
                        return { size, price: '', sale_price: '', cost_price: '' };
                    }
                    return size;
                });
            }
        } else {
            processedData.sizes = [];
        }
        
        if (processedData.variants && Array.isArray(processedData.variants)) {
            processedData.variants = processedData.variants.map(variant => ({
                ...variant,
                sizes: Array.isArray(variant.sizes) ? variant.sizes.map(size => {
                    if (typeof size === 'string') {
                        return { size, price: '', sale_price: '', cost_price: '' };
                    }
                    return size;
                }) : []
            }));
        }
        
        return processedData;
    };

    const handlesave = async (e) => {
        e.preventDefault();
        
        try {
 
            const processedFormData = processFormDataForSubmission(formdata);

            const res = await apisaveProducts(processedFormData);
            
            if (res.message === "Successfully saved") {
                toast.success("Product saved successfully!");
                resetForm();
                getAllProductsData();
            } else {
                toast.error(res.message || "Failed to save product");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save product. Please try again.");
        }
    };

    const handlechange = (e) => {
        const { name, value, files, type, checked } = e.target;
        
        if (type === 'file' && files) {
            if (name === 'Images') {
                const fileArray = Array.from(files);
                setFormdata(prev => ({ ...prev, [name]: fileArray }));
            } else {
                setFormdata(prev => ({ ...prev, [name]: files[0] }));
            }
        } else if (type === 'checkbox') {
            setFormdata(prev => ({ ...prev, [name]: checked }));
        } else {
            if (name === 'sizes' || name === 'variants') {
                setFormdata(prev => ({ ...prev, [name]: value }));
            } else {
                setFormdata(prev => ({ ...prev, [name]: value }));
            }
        }
    };

    const getAllProductsData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apigetallproducts({ first, rows, globalFilter });
            const res1 = await getallHookupsforProduct();
            setTableData({products:res?.resdata?.products || [], totallength: res?.resdata?.totallength, hookups: res1 || []});
        } catch (error) {
            console.error('Error fetching data:', error);
            setTableData({ products: [], totallength: 0 });
            toast.error("Failed to fetch products data");
        } finally {
            setLoading(false);
        }
    }, [first, rows, globalFilter]);

    useEffect(() => {
        if (isMounted) {
            getAllProductsData();
        }
        return () => isMounted = false;
    }, [getAllProductsData]);

    const editform = (data) => {
        
        const cleanData = { ...data };
        
        if (cleanData.sizes && Array.isArray(cleanData.sizes)) {
            cleanData.sizes = cleanData.sizes.map(size => {
                if (typeof size === 'object' && size !== null) {
                    if (size.size !== undefined) {
                        return size; // It's already in correct format
                    } else if (Object.keys(size).some(key => !isNaN(key))) {
                        const values = Object.values(size);
                        if (values.length > 0 && typeof values[0] === 'string') {
                            return { size: values[0], price: '', sale_price: '', cost_price: '' };
                        }
                    }
                }
                return size;
            }).filter(size => size && (typeof size === 'string' || size.size));
        } else {
            cleanData.sizes = [];
        }
        
        if (!cleanData.variants || !Array.isArray(cleanData.variants) || cleanData.variants.length === 0) {
            cleanData.variants = [{ 
                variant_name: 'Default', 
                variant_images: [], 
                description: cleanData.description || '',
                material_care: cleanData.material_care || '',
                sizes: [],
                gender: cleanData.gender || '',
                Product_type: cleanData.Product_type || '',
                tags: cleanData.tags || '',
                price: cleanData.price || '',
                sale_price: cleanData.sale_price || '',
                cost_price: cleanData.cost_price || '',
                stock: cleanData.stock || 'Inactive',
                status: cleanData.status || 'Active',
                sizePricingMode: false
            }];
        } else {
            cleanData.variants = cleanData.variants.map(variant => {
                let variantSizes = variant.sizes || [];
                if (Array.isArray(variantSizes)) {
                    variantSizes = variantSizes.map(size => {
                        if (typeof size === 'object' && size !== null) {
                            if (size.size !== undefined) {
                                return size;
                            } else if (Object.keys(size).some(key => !isNaN(key))) {
                                const values = Object.values(size);
                                if (values.length > 0 && typeof values[0] === 'string') {
                                    return { size: values[0], price: '', sale_price: '', cost_price: '' };
                                }
                            }
                        }
                        return size;
                    }).filter(size => size && (typeof size === 'string' || size.size));
                }

                const cleanVariant = {
                    variant_name: variant.variant_name || '',
                    variant_images: Array.isArray(variant.variant_images) ? variant.variant_images : [],
                    description: variant.description || '',
                    material_care: variant.material_care || '',
                    sizes: variantSizes,
                    gender: variant.gender || '',
                    Product_type: variant.Product_type || '',
                    tags: variant.tags || '',
                    price: variant.price || '',
                    sale_price: variant.sale_price || '',
                    cost_price: variant.cost_price || '',
                    stock: variant.stock || 'Inactive',
                    status: variant.status || 'Active',
                    sizePricingMode: variantSizes.length > 0 && 
                        typeof variantSizes[0] === 'object' && variantSizes[0].size
                };
                return cleanVariant;
            });
        }
        
        console.log('Cleaned data for form:', cleanData);
        setFormdata(cleanData);
        setVisible(true);
    }

    const fetchCustomerCategories = async () => {
        try {
            const response = await getallcustomercategory();
            if (response.resdata) {
                const categoryOptions = response.resdata.map(category => ({
                    label: category.Category_Name,
                    value: category.Category_Name,
                    id: category._id
                }));
                setCustomerCategories(categoryOptions);
            }
        } catch (error) {
            console.error('Error fetching customer categories:', error);
            setCustomerCategories([]);
        }
    };

    useEffect(() => {
        fetchCustomerCategories();
    }, []);


    const handleupdate = async (e) => {
        e.preventDefault();
        const { _id, ...othersdata } = formdata;
        
        try {
            const processedFormData = { ...othersdata };
            
            
            if (processedFormData.sizes) {
                if (typeof processedFormData.sizes === 'string') {
                    processedFormData.sizes = processedFormData.sizes.split(',').map(s => s.trim()).filter(s => s);
                }
            }
            
            const res = await apiupdateproductss(_id, processedFormData);
            
            if (res.message === "Successfully updated") {
                toast.success("Product updated successfully!");
                setVisible(false);
                getAllProductsData();
            } else {
                toast.error("Failed to update product. Please try again.");
            }
        } catch (err) {
            console.error("Update Error:", err);
            toast.error(err.response?.data?.message || "Failed to update product data");
        }
    };

    const handledelete = async (_id) => {
        try {
            const res = await apideleteproducts(_id);
            if (res.message === "Successfully deleted") {
                toast.success("Product deleted successfully!");
                getAllProductsData();
            } else {
                toast.error("Failed to delete product. Please try again.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete product. Please try again.");
        }
    }

    const confirm = (_id) => {
        confirmDialog({
            message: 'Do you want to delete this product? This action cannot be undone.',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger bg-red-500 ml-2 text-white py-2 px-3 rounded',
            rejectClassName: 'ml-2 py-2 px-3 bg-gray-200 text-gray-700 rounded',
            accept: () => { handledelete(_id) }
        });
    };

    return (
        <div className="">
            <Tableheadpanel openform={openform} setGlobalFilter={setGlobalFilter} />
            <Addandeditform visible={visible} setVisible={setVisible} customerCategories={customerCategories} formdata={formdata} handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate}  hookupsData={tableData?.hookups || []}  />
            <Tableview loading={loading} onPage={onPage} tableData={tableData?.products || []} editform={editform} confirm={confirm} />
            {tableData?.products?.length > 0 && (
                <Cuspagination first={first} rows={rows} totalRecords={tableData?.totallength || 0} onPage={onPage}/>
            )}
            <ConfirmDialog />
        </div>
    );
}