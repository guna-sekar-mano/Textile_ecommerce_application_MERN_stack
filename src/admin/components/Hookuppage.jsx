import { useCallback, useEffect, useState } from "react";
import Addandeditform from "../shared/components/hookups/AddandEditform";
import Tableheadpanel from "../shared/components/hookups/Tableheadpanel";
import { apideleteHookups, apigetallHookups, apisaveHookups, apiupdateHookups } from "../shared/services/apihookups/apihookups";
import toast from "react-hot-toast";
import Tableview from "../shared/components/hookups/Tableview";
import Cuspagination from "../hooks/CustomPagination";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function Hookuppage () {

    const [formdata,setformdata]=useState({Status: ""});
    const [visible, setVisible] = useState(false);
    const [tableData, setTableData] = useState();
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tags');
    const [colfilter, setcolFilter] = useState({});
    const [Sort, setSort] = useState({});
    const [tempFilterValues, setTempFilterValues] = useState([]);

    let isMounted = true;

    const tabs = [
        { key: 'tags', label: 'Tags', field: 'tags' },
        { key: 'sizes', label: 'Sizes', field: 'sizes' },
        { key: 'gender', label: 'Gender', field: 'gender' },
        { key: 'Product_type', label: 'Product Type', field: 'Product_type' },
        { key: 'Color', label: 'Color', field: 'Color' },
    ];

    const openform=()=>{
        setformdata({Status: ""});
        setVisible(true)
    }

    const handlechange=(e)=>e.target.files?setformdata({...formdata,...{[e.target.name]:e.target.files[0]}}):setformdata({...formdata,[e.target.name]:e.target.value});

    const handlesave = async (e) => {
        e.preventDefault();
        try {
            const res = await apisaveHookups(formdata);
            if (res.message === "Successfully saved") {
                toast.success("Hookup data successfully saved");
                await getAllHookups();
                setVisible(false);
            } else {
                toast.error("Failed to save Hookup data");
            }
        } catch (error) {
            toast.error("Failed to save Hookup data");
        }
    };

    const getAllHookups = useCallback(async () =>{
        setLoading(true);
        try {
            const tabFilter = {...colfilter,[activeTab]: { $exists: true, $nin: [null, ''] }};
            
            const res = await apigetallHookups({ first, rows, globalFilter, colfilter: tabFilter,Sort });
            
            setTableData(res); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setTableData({ resdata: [], totallength: 0 });
        } finally {
            setLoading(false);
        }
    },[first, rows, globalFilter, colfilter, Sort, activeTab])
    
    useEffect(()=>{
        if(isMounted){
            getAllHookups();
        }
        return(()=>isMounted = false);
    },[getAllHookups]);

    const onPage = (pages) => {
        setPage(pages);
        setFirst(pages.first);
        setRows(rows);
    };

    const clearFilter = (event)=>{
        setcolFilter({});
        setGlobalFilter('')
        setTempFilterValues([])
        setFirst(0)
        setSort({})
    }

    const cusfilter = (field, value) => {
        setcolFilter(prev => ({ ...prev, [field]: {$in:value} }));
        setFirst(0);
    };

    const editform = (data) => {
        const cleanData = { ...data };
        setformdata(cleanData);
        setVisible(true);
    }

    const handleupdate = async (e) => {
        e.preventDefault();
        try {
            const { _id, ...Othersdata } = formdata;
            const res = await apiupdateHookups( _id, Othersdata);
            if (res && res.message === "Successfully updated") {
                toast.success("Hookups updated successfully.");
                setVisible(false);
                await getAllHookups();
            } else {
                toast.error("Failed to update details. Please try again.");
            }
        } catch (err) {
            console.error("Update Error:", err);
            toast.error(err.response?.data?.message || "Failed to update application");
        }
    };

    const handledelete = async (_id) => {
        const res = await apideleteHookups(_id);
        if (res.message === "Successfully deleted") {
            toast.success("Hookup data deleted successfully.");
            await getAllHookups();
        } else {
            toast.error("Failed to delete details. Please try again.");
        }
    }

    const confirm = (_id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger bg-red-500 ml-2 text-white py-2 px-3',
            rejectClassName: 'ml-2  py-2 px-3',
            accept: () => { handledelete(_id) }
        });
    };

    return (
        <>
        <div className="bg-white shadow-sm border-b">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => {
                        setActiveTab(tab.key);
                        setFirst(0);
                    }}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab.key ? 'border-black text-black bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="">
            <Tableheadpanel openform={openform} setGlobalFilter={setGlobalFilter} globalFilter={globalFilter} clearFilter={clearFilter} />
            <Addandeditform formdata={formdata} visible={visible} setVisible={setVisible} handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate} activeTab={activeTab} />
            <Tableview confirm={confirm} loading={loading} onPage={onPage} tableData={tableData} editform={editform} activeTab={activeTab} />
            {tableData?.resdata?.length > 0 && (
                <Cuspagination first={first} rows={rows} totalRecords={tableData?.totallength || 0} onPage={onPage}/>
            )}
            <ConfirmDialog />
        </div>
        </>
    )
}