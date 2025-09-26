import moment from "moment-timezone"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { getFilterOptions } from "../../../../shared/services/apiorder/apiorder";

export default function Tableview (props) {
    const { tabledata, editfrom, viewProducts, first, rows, onPage, cusfilter, tempFilterValues,setTempFilterValues, loading, Sort, setSort, downloadPDF, downloadingPDF } = props;
    const [filterOptions, setFilterOptions] = useState([]);


    const actionbotton = (rowData) => {
        return (
            <div className="flex gap-2">
                <button title="Payment Status" onClick={() => editfrom(rowData)} className="inline-flex items-center text-xl font-medium text-green-600 gap-x-1 decoration-2 " >
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
                <button title="View Products" onClick={() => viewProducts(rowData?.Order_id)} className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 " >
                    <i className="fi fi-rr-eye"></i>
                </button>
                <button title="Download PDF" onClick={() => downloadPDF(rowData.Order_id)} disabled={downloadingPDF[rowData.Order_id]} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2" >
                    {downloadingPDF[rowData.Order_id] ? ( <i className="fas fa-spinner fa-spin"></i> ) : ( <i className="text-red-500 fi fi-rr-file-pdf"></i> )}
                </button>
            </div>
        )
    }

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
        var filterOptions = await getFilterOptions(key.field);
        var formatoption = {[key.field]:filterOptions[key.field].map(val => (key.format == "Date" ? moment(val).format('YYYY-MM-DD') : val ))};
        setFilterOptions(formatoption);
    }

    const onSort = (event) => {
        setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
    };

    const Filter = (key) =>{
        return(
            <div onClick={()=>getOption(key)}>
                <MultiSelect filter value={tempFilterValues[key.field]} options={filterOptions?.[key.field]} className="p-column-filter" virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1}
                    onChange={(e) => setTempFilterValues(prev => ({ ...prev, [key.field]: e.value }))} placeholder={`Select ${key?.field?.charAt(0).toUpperCase() + key?.field?.slice(1)}`} panelFooterTemplate={
                    <div className="flex justify-between mt-2 p-2">
                        <button label="Clear" onClick={() => handleClearFilters(key.field)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                            Clear
                        </button>
                        <button label="Apply" onClick={() => handleApplyFilters(key.field)} className="flex items-center text-center justify-center gap-1 px-4 py-2.5 text-sm w-[45%] shadow-sm bg-black text-white cursor-pointer" >
                            Apply
                        </button>
                    </div>
                } />
            </div>
        )
    };

    const columns = [
        { field: 'Order_id', header: 'Order ID', filter: true },
        { field: 'Order_Date', header: 'Order Date', filter: true, format: "Date", width: "150px" },
        { field: 'Invoice_ID', header: 'Invoice ID', filter: true, width: "150px" },
        { field: 'Payment_Id', header: 'Payment ID', filter: true, width: "150px" },
        { field: 'Billing_Name', header: 'Billing Name', width: "150px" },
        { field: 'Email', header: 'Email', width: "150px" },
        { field: 'Mobilenumber', header: 'Mobile Number', width: "150px" },
        { field: 'City', header: 'City', filter: true, width: "150px" },
        { field: 'Delivery_Address', header: 'Delivery Address', width: "200px" },
        { field: 'Total_Amount', header: 'Total Amount', width: "150px" },
        { field: 'Payment_Status', header: 'Payment Status', width: "150px", filter: true },
        { field: 'Order_Status', header: 'Order Status', width: "150px", filter: true },
    ];

    return (
        <>
            <div>
                <DataTable value={tabledata} scrollable scrollHeight="680px" onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder}
                    className="!text-sm border border-gray-200 rounded" stateStorage="session" stateKey="dt-state-demo-local" >
                    <Column header="Action" body={actionbotton} />
                    {/* <Column header="Images"  body={image} /> */}
                    {columns.map((col, i) => (
                    <Column key={i} field={col.field} header={col.header} filter={col.filter} filterElement={Filter(col)} showFilterMenuOptions={false} showApplyButton={false}
                        showClearButton={false} showFilterMatchModes={false} style={{ minWidth: col.width }} sortable
                        body={(rowData, meta) => { if (col.format == "Date") { return moment(rowData[meta.field]).format("YYYY-MM-DD") } else if (col.format == "HTML") { return <div dangerouslySetInnerHTML={{ __html: rowData[meta.field] }} /> } else { return rowData[meta.field] } }} />
                    ))}
                </DataTable>
            </div>
        </>
    )
}