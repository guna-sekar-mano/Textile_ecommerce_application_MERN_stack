import { useCallback, useEffect, useState } from "react";
import AddandEditform from "../shared/components/Homecategories/AddandEditform";
import Tableheadpanel from "../shared/components/Homecategories/Tableheadpanel";
import toast from "react-hot-toast";
import Tableview from "../shared/components/Homecategories/Tableview";
import Cuspagination from "../hooks/CustomPagination";
import apiurl from "../../shared/services/apiendpoint/apiendpoint";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { deleteCategories, getallCategories, saveCategories, updatedeCategories } from "../shared/services/apihomeCategories/apihomecategories";

export default function Homecategoriespage () {

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [visible, setVisible] = useState(false);
    const [formdata,setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter,setglobalfilter]=useState('');
    const [filtervalues,setfiltervalues]=useState([]);
    const [file, setFile] = useState();
    let isMounted = true;

    const getcategories = useCallback(async ()=>{
        setLoading(true)
        try {
            const res= await getallCategories({ first, rows, globalfilter, ...colfilter });
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
 
        } catch (error) {
            console.error("Error in getcategories:", error);
        }
        setLoading(false)
    },[first,rows,globalfilter,colfilter]);

    useEffect(()=>{
        if(isMounted){
            getcategories();
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

    const handlesave=async (e)=>{
        e.preventDefault()
        setLoading(true)
        
        await saveCategories(formdata)
        toast.success("Successfully saved")
        getcategories()
        setVisible(false)
        setLoading(false)
    }

    const handleupdate=async (e)=>{
        e.preventDefault()
        setLoading(true)
        
        await updatedeCategories(formdata)
        toast.success("Successfully updated")
        getcategories()
        setVisible(false)
        setLoading(false)
    }

    const newform=()=>{
        setFormdata({});
        setFile();
        setVisible(true)
    }
    
    const editfrom=(data)=>{
        setFormdata(data);
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
             await deleteCategories(id)
             toast.success("Successfully deleted")
             getcategories()
            }
        });
    };

    return (
        <>
        <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter}/>
        <AddandEditform 
            visible={visible} 
            handleupdate={handleupdate} 
            file={file} 
            setVisible={setVisible} 
            loading={loading} 
            formdata={formdata} 
            setFormdata={setFormdata}
            handlechange={handlechange} 
            handlesave={handlesave}
        />
        <Tableview 
            loading={loading} 
            tabledata={tabledata} 
            handledelete={handledelete} 
            totalRecords={totalRecords} 
            first={first} 
            editfrom={editfrom}
            cusfilter={cusfilter} 
            filtervalues={filtervalues} 
            handlefiltervalue={handlefiltervalue}
        />
        <Cuspagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}/>
        <ConfirmDialog />
        </>
    )
}