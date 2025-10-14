import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import AddandEditform from "../shared/components/Coupons/Addandeditform";
import Tableheadpanel from "../shared/components/Coupons/Tableheadpanel";
import Tableview from "../shared/components/Coupons/Tableview";
import { deleteCoupons, getAllCoupons, saveCoupons, updateCoupons } from "../shared/services/apiCoupons/apicoupons";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import Cuspagination from "../hooks/CustomPagination";

export default function Couponspage () {

    const [visible, setVisible] = useState(false);
    const [formdata,setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [globalfilter,setglobalfilter]=useState('');
    const [rows, setRows] = useState(10);
    const [colfilter, setcolFilter] = useState({});

    let isMounted = true;

    const newform=()=>{
        setVisible(true);
        setFormdata({});
    }

     const handlechange = (e) => {
        const { name, value } = e.target;
        setFormdata(prev => ({...prev,[name]: value}));
    }

    const handlesave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Saving coupon:', formdata);
            
            await saveCoupons(formdata);
            toast.success("Coupon saved successfully");
            await getallCoupons();
            setFormdata({});
            setVisible(false);
            
        } catch (error) {
            console.error('Error saving coupon:', error);
        } finally {
            setLoading(false);
        }
    }

    const getallCoupons = useCallback(async ()=>{
        setLoading(true)
        const res= await getAllCoupons({first,rows,globalfilter,...colfilter});
        setLoading(false)
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getallCoupons();
        }
        return(()=>isMounted = false);
    },[first,rows,globalfilter,colfilter]);

    const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
    };

    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true);
    }

    const handleupdate=async (e)=>{
        e.preventDefault()
        setLoading(true)
        await updateCoupons(formdata._id, formdata)
        toast.success("Sucessfully updated")
        getallCoupons()
        setVisible(false)
        setLoading(false)
    };

    const handledelete = (_id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept:async ()=>{
             await deleteCoupons(_id)
             toast.success("Sucessfully deleted")
             getallCoupons()
            }
        });
    };

    return (
        <>
        <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter}/>
        <AddandEditform visible={visible} setVisible={setVisible} formdata={formdata} handlechange={handlechange} loading={loading} handlesave={handlesave} handleupdate={handleupdate}/>
        <Tableview tabledata={tabledata} editfrom={editfrom} handledelete={handledelete} />
        <Cuspagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}/>
        <ConfirmDialog />
        </>
    )
}