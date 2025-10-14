import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function Tableview (props) {

     const {tableData, totalRecords, first, rows, loading, Sort, setSort, setTempFilterValues, tempFilterValues, cusfilter, onPage} = props;
        const [filterOptions,setFilterOptions] = useState({});
    
        const Sno = (rowIndex) => {
            console.log(first  , rowIndex);
            return (
                <>
                  <div className="flex gap-3">
                    {first+rowIndex+1}
                  </div>
                </>
            );
        };
    
        const columns = [
            { header: 'S.No', body: Sno },
            { field: 'Newsletter_email', header: 'Emails', filter: true },
           
        ];
    
        const handleApplyFilters = (key) => {
            cusfilter(key, tempFilterValues[key]);
            onPage({ first: 0, rows: rows });
        };
    
        const handleClearFilters = (key) => {
            setTempFilterValues(prev => ({ ...prev, [key]: null }));
            cusfilter(key, null);
            onPage({ first: 0, rows: rows });
        };
    
        const getOption = async (key)=>{
            var filterOptions = await getFilterOptions(key);
            setFilterOptions(filterOptions)
            console.log(filterOptions)
        }
    
        const renderColumnFilter = (key) => (
            <div onClick={()=>getOption(key)}>
                <MultiSelect filter value={tempFilterValues[key]} options={filterOptions?.[key]} className="p-column-filter" virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1}
                    onChange={(e) => setTempFilterValues(prev => ({ ...prev, [key]: e.value }))} placeholder={`Select ${key?.charAt(0).toUpperCase() + key?.slice(1)}`} panelFooterTemplate={
                    <div className="flex justify-between mt-2 p-2">
                        <button label="Clear" onClick={() => handleClearFilters(key)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                            Clear
                        </button>
                        <button label="Apply" onClick={() => handleApplyFilters(key)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                            Apply
                        </button>
                    </div>
                } />
            </div>
        );
    
        const onSort = (event) => {
            setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
        };
    

    return (
        <>
           <DataTable value={tableData} loading={loading} totalRecords={totalRecords} scrollable scrollHeight="calc(100vh - 320px)"
                onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder} className="!text-sm border border-gray-200 rounded">
                {columns.map((col, i) => (
                    col.header === 'S.No' ?(
                        <Column key={i} field={col.field} header={col.header} body={(rowData,{rowIndex})=>Sno(rowIndex)} headerClassName="text-gray-700 bg-gray-50" />
                    ):
                    col.formattype === 'array' ? (
                        <Column key={i} header={col.header} field={col.field} style={{ minWidth: col.width }} body={array} filter={col.filter} filterElement={renderColumnFilter(col.field)}
                            showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable headerClassName="text-gray-700 bg-gray-50"/>
                    ) : (
                        <Column key={i} field={col.field} header={col.header} body={col.body} filter={col.filter} filterElement={renderColumnFilter(col.field)}
                            showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable headerClassName="text-gray-700 bg-gray-50" />
                    )
                ))}
            </DataTable>
    </>
    )
}