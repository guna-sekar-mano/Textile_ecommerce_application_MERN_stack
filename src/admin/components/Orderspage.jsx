import { useCallback, useEffect, useState } from "react";
import Addandeditform from "../shared/components/Orders/Addandeditform";
import Tableheadpanel from "../shared/components/Orders/Tableheadpanel";
import Tableview from "../shared/components/Orders/Tableview";
import { apidownloadPDF, getallorders, getOrderitemsbyid, updateOrder } from "../../shared/services/apiorder/apiorder";
import toast from "react-hot-toast";
import ViewOrders from "../shared/components/Orders/ViewOrders";
import { saveAs } from 'file-saver';

export default function Orderspage () {

    const [totalRecords, setTotalRecords] = useState(0);
    const [tabledata, setTabledata]=useState([]);
    // const [colfilter, setcolFilter] = useState({});
    const [globalfilter,setglobalfilter]=useState('');
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [visible, setVisible] = useState(false);
    const [formdata,setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [filtervalues,]=useState([]); // setfiltervalues
    const [ViewProduct, setViewProduct] = useState(false);
    const [ViewProductData,setViewProductData]=useState([]);
    const [downloadingPDF, setDownloadingPDF] = useState({});
    const [tempFilterValues, setTempFilterValues] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [Sort, setSort] = useState({});

    let isMounted = true;

    const getallorder = useCallback(async ()=>{
        const res= await getallorders({first, rows, globalfilter, colfilter,Sort});
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);
    },[first, rows, globalfilter, colfilter,Sort]);

    useEffect(()=>{
        if(isMounted){
            getallorder();
        }
        return(()=>isMounted = false);
    },[first, rows, globalfilter, colfilter,Sort])

    const onPage = (page) => {
        setPage(page);
        // console.log(rows,pages )
        setFirst(page.first);
        setRows(rows);
    };

    const cusfilter = (field, value) => {
        setcolFilter(prev => ({ ...prev, [field]: {$in:value} }));
        setFirst(0)
    };

    const clearFilter = (event)=>{
        setcolFilter(null);
        setglobalfilter('')
        // setTempFilterValues([])
        setFirst(0)
        // setSort({})
    }

    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true)
    }
    const downloadPDF = async (orderId) => {
        setDownloadingPDF(prev => ({ ...prev, [orderId]: true }));
        try {
            var resData = await apidownloadPDF(orderId);
            const pdfBlob = new Blob([resData], { type: 'application/pdf' });
            const pdfFileName = `${orderId}.pdf`;
            saveAs(pdfBlob, pdfFileName);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            toast.error("Failed to download PDF");
        } finally {
            setDownloadingPDF(prev => ({ ...prev, [orderId]: false }));
        }
    }


    const viewProducts = async(Order_id) =>{
        var res = await getOrderitemsbyid(Order_id);
        setViewProductData(res);
        setViewProduct(true)
    }

    const handlechange = (e) => {
        // console.log({...formdata, [e.target.name]: e.target.value})
        setFormdata({...formdata, [e.target.name]: e.target.value});
    }

    const handleupdate=async (e)=>{
        e.preventDefault()
        setLoading(true)
        await updateOrder(formdata)
        toast.success("Sucessfully updated")
        getallorder()
        setVisible(false)
        setLoading(false)
    }

    return (
        <>
            <Tableheadpanel clearFilter={clearFilter} setglobalfilter={setglobalfilter} globalfilter={globalfilter} />
            <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} editfrom={editfrom} setLoading={setLoading} downloadingPDF={downloadingPDF}
                onPage={onPage} page={page} downloadPDF={downloadPDF} viewProducts={viewProducts} cusfilter={cusfilter} Sort={Sort} setSort={setSort} clearFilter={clearFilter}
                tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} />
            <Addandeditform visible={visible} setVisible={setVisible} loading={loading} formdata={formdata} setFormdata={setFormdata}
                handlechange={handlechange} handleupdate={handleupdate} />
            <ViewOrders ViewProduct={ViewProduct} setViewProduct={setViewProduct} ViewProductData={ViewProductData} />
        </>
    )
}