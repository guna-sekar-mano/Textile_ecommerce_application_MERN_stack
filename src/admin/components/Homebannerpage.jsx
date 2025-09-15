import { useCallback, useEffect, useState } from "react";
import AddandEditform from "../shared/components/HomeBanner/AddandEditform";
import Tableheadpanel from "../shared/components/HomeBanner/Tableheadpanel";
import { apigetallproductsCustomers } from "../../shared/services/apicustomerProducts/apicustomerproducts";
import { deleteBanner, getallBanner, saveBanners, updatedBanner } from "../shared/services/apihomebanner/apihomebanner";
import toast from "react-hot-toast";
import Tableview from "../shared/components/HomeBanner/Tableview";
import Cuspagination from "../hooks/CustomPagination";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

export default function Homebannerpage () {

    const [visible, setVisible] = useState(false);
    const [globalfilter,setglobalfilter]=useState('');
    const [formdata,setFormdata]=useState({});
    const [file, setFile] = useState();
    const [productname,setProductname]=useState([])
    const [productData, setProductData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filtervalues,setfiltervalues]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);

    let isMounted = true;

    const getbanners = useCallback(async ()=>{
        setLoading(true)
        try {
            const res= await getallBanner({first,rows,globalfilter,...colfilter});
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
            console.error("Error in getbanners:", error);
            setProductname([]);
            setProductData([]);
        }
        setLoading(false)
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){ getbanners(); }
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

    const getProductIdsByNames = (productNames) => {
        if (!Array.isArray(productNames)) return [];
        
        return productNames.map(productName => {
            const product = productData.find(p => p.Product_Name === productName);
            return product ? product._id : null;
        }).filter(Boolean);
    };

    const handlesave=async (e)=>{
        e.preventDefault()
        setLoading(true)

        const formDataToSend = { ...formdata };
        if (formdata.productname && Array.isArray(formdata.productname)) {
            formDataToSend.ProductId = getProductIdsByNames(formdata.productname);
            delete formDataToSend.productname;
        }
        
        await saveBanners(formDataToSend)
        toast.success("Successfully saved")
        getbanners()
        setVisible(false)
        setLoading(false)
    }

    const handleupdate=async (e)=>{
        e.preventDefault()
        setLoading(true)
        
        const formDataToSend = { ...formdata };
        if (formdata.productname && Array.isArray(formdata.productname)) {
            formDataToSend.ProductId = getProductIdsByNames(formdata.productname);
            delete formDataToSend.productname;
        }
        
        await updatedBanner(formDataToSend)
        toast.success("Successfully updated")
        getbanners()
        setVisible(false)
        setLoading(false)
    }

    const newform=()=>{
        setFormdata({});
        setFile();
        setVisible(true)
    }
    
    const editfrom=(data)=>{
        const productNamesForEdit = data.ProductId ? 
            data.ProductId.map(productId => {
                if (typeof productId === 'object' && productId.Product_Name) {
                    return productId.Product_Name;
                } else {
                    const product = productData.find(p => p._id === productId);
                    return product ? product.Product_Name : null;
                }
            }).filter(Boolean) : [];

        setFormdata({...data, productname: productNamesForEdit});
        setVisible(true);
        setFile(apiurl()+"/"+data.Images[0])
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
             await deleteBanner(id)
             toast.success("Successfully deleted")
             getbanners()
            }
        });
    };

    return (
        <>
        <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter}/>
        <AddandEditform visible={visible} setVisible={setVisible} productname={productname} setFormdata={setFormdata} 
            handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate} file={file} formdata={formdata} loading={loading} />
        <Tableview loading={loading} 
            tabledata={tabledata} 
            handledelete={handledelete} 
            totalRecords={totalRecords} 
            first={first} 
            editfrom={editfrom}
            cusfilter={cusfilter} 
            filtervalues={filtervalues} 
            handlefiltervalue={handlefiltervalue} />
        <Cuspagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}/>
        <ConfirmDialog />
        </>
    )
}