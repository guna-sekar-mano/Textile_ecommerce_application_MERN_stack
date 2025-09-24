import { useCallback, useEffect, useState } from "react";
import Tableheadpanel from "../shared/components/Customer/Tableheadpanel";
import Tableview from "../shared/components/Customer/Tableview";
import { getallcustomers } from "../shared/services/apicustomers/apicustomers";
import Cuspagination from "../hooks/CustomPagination";

export default function Customerpage () {

    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [colfilter, setcolFilter] = useState({});
    const [Sort, setSort] = useState({});
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState();

    let isMounted = true;

    const getAllCustomers = useCallback(async () =>{
        setLoading(true);
        try {
            const res = await getallcustomers({first, rows, globalFilter, colfilter,Sort});
            setTableData({resdata:res?.resdata,totallength: res?.totallength}); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setTableData([]);
        } finally {
            setLoading(false);
        }
    },[first, rows, globalFilter, colfilter,Sort])
    
    useEffect(()=>{
        if(isMounted){
            getAllCustomers();
        }
        return(()=>isMounted = false);
    },[first, rows, globalFilter, colfilter,Sort]);

    const onPage = (pages) => {
        setPage(pages);
        // console.log(rows,pages )
        setFirst(pages.first);
        setRows(rows);
    };

    const clearFilter = (event)=>{
        setcolFilter(null);
        setGlobalFilter('')
        setTempFilterValues([])
        setFirst(0)
        setSort({})
    }

    const cusfilter = (field, value) => {
        setcolFilter(prev => ({ ...prev, [field]: {$in:value} }));
        setFirst(0); // Reset to first page when applying a new filter
        console.log(first)
    };

    return (
        <>
            <Tableheadpanel setGlobalFilter={setGlobalFilter}/>
            <Tableview loading={loading} onPage={onPage} tableData={tableData.resdata} totallength={tableData.totallength} cusfilter={cusfilter} Sort={Sort}
                setSort={setSort} clearFilter={clearFilter} tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} />
                
            {tableData?.length > 0 && (
                <Cuspagination first={first} rows={rows} totalRecords={tableData?.totallength || 0} onPage={onPage}/>
            )}
        </>
    )
}