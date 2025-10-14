import { useCallback, useEffect, useState } from "react";
import { getNewsletters } from "../../shared/services/apinewsletter/apinewsletter";
import Tableheadpanel from "../shared/components/Newsletter/Tableheadpanel";
import Tableview from "../shared/components/Newsletter/Tableview";
import Cuspagination from "../hooks/CustomPagination";


export default function Newsletterpage () {

        const [page, setPage] = useState(1);
        const [first, setFirst] = useState(0);
        const [rows, setRows] = useState(10);
        const [globalFilter, setGlobalFilter] = useState('');
        const [colfilter, setcolFilter] = useState({});
        const [Sort, setSort] = useState({});
        const [loading, setLoading] = useState(false);
        const [tableData, setTableData] = useState();
        const [tempFilterValues, setTempFilterValues] = useState([]);
    
        let isMounted = true;
    
        const getAllNewsletters = useCallback(async () =>{
            setLoading(true);
            try {
                const res = await getNewsletters({first, rows, globalFilter, colfilter,Sort});
                // console.log(res)
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
                getAllNewsletters();
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
            // console.log(first)
        };

    return (
        <>
        <Tableheadpanel setGlobalFilter={setGlobalFilter} globalFilter={globalFilter} clearFilter={clearFilter}/>
        <Tableview loading={loading} onPage={onPage} tableData={tableData?.resdata} totallength={tableData?.totallength} cusfilter={cusfilter} Sort={Sort}
                setSort={setSort} clearFilter={clearFilter} tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} first={first} />
              {tableData?.totallength > 0 && (
                    <Cuspagination first={first} rows={rows} totalRecords={tableData?.totallength || 0} onPage={onPage}/>
                )}
        </>
    )
}