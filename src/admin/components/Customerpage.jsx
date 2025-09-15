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
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState();

    let isMounted = true;

    const getAllCustomers = useCallback(async () =>{
        setLoading(true);
        try {
            const res = await getallcustomers({first, rows, globalFilter});
            setTableData(res?.resdata); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setTableData([]);
        } finally {
            setLoading(false);
        }
    },[])
    
    useEffect(()=>{
        if(isMounted){
            getAllCustomers();
        }
        return(()=>isMounted = false);
    },[first,rows,globalFilter]);

    const onPage = (page) => {
        setPage(page)
        setFirst(rows *(page -1));
        setRows(rows);
    };

    return (
        <>
            <Tableheadpanel setGlobalFilter={setGlobalFilter}/>
            <Tableview loading={loading} onPage={onPage} tableData={tableData}/>
            {tableData?.length > 0 && (
                <Cuspagination first={first} rows={rows} totalRecords={tableData?.totallength || 0} onPage={onPage}/>
            )}
        </>
    )
}