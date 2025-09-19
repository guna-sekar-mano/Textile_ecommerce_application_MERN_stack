import toast from "react-hot-toast";
import Addandeditform from "../shared/components/PopularProducts/AddandEditform";
import Tableheadpanel from "../shared/components/PopularProducts/Tableheadpanel";
import { deletePopularproducts, getallPopularproducts, savePopularproducts, updatedePopularproducts } from "../shared/services/apipopularproducts/apipopularproducts";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import apiurl from "../../shared/services/apiendpoint/apiendpoint";
import { useCallback, useEffect, useState } from "react";
import Cuspagination from "../hooks/CustomPagination";
import Tableview from "../shared/components/PopularProducts/Tableview";
import { apigetallproductsCustomers } from "../../shared/services/apicustomerProducts/apicustomerproducts";

export default function Popularproductspage () {

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [productname,setProductname]=useState([])
    const [productData, setProductData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [formdata,setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter,setglobalfilter]=useState('');
    const [filtervalues,setfiltervalues]=useState([]);
    const [file, setFile] = useState();
    let isMounted = true;

    const getPopularproducts = useCallback(async ()=>{
        setLoading(true)
        try {
            const res= await getallPopularproducts({first,rows,globalfilter,...colfilter});
            const res1= await apigetallproductsCustomers();
            
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);

            let productNames = [];
            let fullProductData = [];

            if (res1) {
                if (Array.isArray(res1)) {
                    fullProductData = res1;
                    productNames = res1.map(product => product?.Product_Name).filter(Boolean);
                }
                else if (res1.resdata && Array.isArray(res1.resdata)) {
                    fullProductData = res1.resdata;
                    productNames = res1.resdata.map(product => product?.Product_Name).filter(Boolean);
                }
                else if (res1.data && Array.isArray(res1.data)) {
                    fullProductData = res1.data;
                    productNames = res1.data.map(product => product?.Product_Name).filter(Boolean);
                }
                else if (res1.Product_Name) {
                    fullProductData = [res1];
                    productNames = [res1.Product_Name];
                }
            }

            setProductname(productNames);
            setProductData(fullProductData);
 
            
        } catch (error) {
            console.error("Error in getcategories:", error);
        }
        setLoading(false)
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getPopularproducts();
        }
        return(()=>isMounted = false);
    },[first,rows,globalfilter,colfilter])

    const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
      };
      
    const handlefiltervalue=async(field) => {
        const res=await getuniquevaluebyfield({field})
        setfiltervalues(res)
    }
    
    const reader = new FileReader();

    reader.onloadend = () => {
      setFile(reader.result);
    };

    const handlechange = (e)=>{
        if(e.target.files){
            setFormdata({...formdata,...{[e.target.name]:e.target.files}});
            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            setFormdata({...formdata,...{[e.target.name]:e.target.value}});
        }
    }

    const cusfilter = (field, value) => {
        setcolFilter({...colfilter,...{[field]:value}})
    };

    const getProductIdByName = (productName) => {
        const product = productData.find(p => p.Product_Name === productName);
        return product ? product._id : null;
    };

    const getProductIdsByNames = (productNames) => {
        if (!Array.isArray(productNames)) return [];
        
        return productNames.map(productName => {
            const product = productData.find(p => p.Product_Name === productName);
            return product ? product._id : null;
        }).filter(Boolean);
    };


    const handlesave = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formDataToSend = { ...formdata };
        
        if (formdata.productname && Array.isArray(formdata.productname)) {
            formDataToSend.ProductId = getProductIdsByNames(formdata.productname);
            delete formDataToSend.productname;
        }
        
        if (formdata.highlightedProduct) {
            formDataToSend.HighlightedProductId = getProductIdByName(formdata.highlightedProduct);
            delete formDataToSend.highlightedProduct;
        }
        
        await savePopularproducts(formDataToSend)
        toast.success("Successfully saved")
        getPopularproducts()
        setVisible(false)
        setLoading(false)
    }

    const handleupdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        const formDataToSend = { ...formdata };
        
        if (formdata.productname && Array.isArray(formdata.productname)) {
            formDataToSend.ProductId = getProductIdsByNames(formdata.productname);
            delete formDataToSend.productname;
        }
        
        if (formdata.highlightedProduct) {
            formDataToSend.HighlightedProductId = getProductIdByName(formdata.highlightedProduct);
            delete formDataToSend.highlightedProduct;
        }
        
        await updatedePopularproducts(formDataToSend)
        toast.success("Successfully updated")
        getPopularproducts()
        setVisible(false)
        setLoading(false)
    }

    const newform=()=>{
        setFormdata({});
        setFile();
        setVisible(true)
    }
    
    const editfrom = (data) => {
        const productNames = data.ProductId ? 
            data.ProductId.map(id => {
                const product = productData.find(p => p._id === id);
                return product ? product.Product_Name : null;
            }).filter(Boolean) : [];

        const highlightedProductName = data.HighlightedProductId ? 
            productData.find(p => p._id === data.HighlightedProductId)?.Product_Name : '';

        setFormdata({...data, productname: productNames, highlightedProduct: highlightedProductName });
        setVisible(true);
        if (data.Images && data.Images[0]) {
            setFile(apiurl() + "/" + data.Images[0]);
        }
    }

    const handledelete = (id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept:async ()=>{
             await deletePopularproducts(id)
             toast.success("Successfully deleted")
             getPopularproducts()
            }
        });
    };

    return (
        <>
        <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter}/>
        <Addandeditform visible={visible} handleupdate={handleupdate} productname={productname} file={file} setVisible={setVisible} loading={loading} formdata={formdata} setFormdata={setFormdata}
            handlechange={handlechange} handlesave={handlesave}/>
        <Tableview loading={loading} tabledata={tabledata} handledelete={handledelete} totalRecords={totalRecords} first={first} editfrom={editfrom} cusfilter={cusfilter} 
            filtervalues={filtervalues} handlefiltervalue={handlefiltervalue}/>
        <Cuspagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}/>
        <ConfirmDialog/>
        </>
    )
}