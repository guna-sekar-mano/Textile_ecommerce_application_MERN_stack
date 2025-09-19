import { useCallback, useEffect, useState } from "react";
import Addandeditform from "../shared/components/Orders/Addandeditform";
import Tableheadpanel from "../shared/components/Orders/Tableheadpanel";
import Tableview from "../shared/components/Orders/Tableview";
import { apidownloadPDF, getallorders, getOrderitemsbyid, updateOrder } from "../../shared/services/apiorder/apiorder";
import toast from "react-hot-toast";

export default function Orderspage () {

    const [totalRecords, setTotalRecords] = useState(0);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
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

    let isMounted = true;

    const getallorder = useCallback(async ()=>{
        const res= await getallorders({first,rows,globalfilter,colfilter});
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getallorder();
        }
        return(()=>isMounted = false);
    },[first,rows,globalfilter,colfilter])

        const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
    };

    const cusfilter = (field, value) => {
        setcolFilter(prev => ({ ...prev, [field]: {$in:value} }));
        setFirst(0)
    };
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
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormdata({...formdata, [e.target.name]: filesArray});
        } else {
            setFormdata({...formdata, [e.target.name]: e.target.value});
        }
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
        <Tableheadpanel setglobalfilter={setglobalfilter} />
        <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} editfrom={editfrom} setLoading={setLoading}  downloadingPDF={downloadingPDF}
                    cusfilter={cusfilter} filtervalues={filtervalues} onPage={onPage} page={page} downloadPDF={downloadPDF} viewProducts={viewProducts} />
        <Addandeditform visible={visible} setVisible={setVisible} loading={loading} formdata={formdata} setFormdata={setFormdata}
                    handlechange={handlechange} handleupdate={handleupdate} />
        </>
    )
}